import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
  isFileRemoved,
} from './lib/github-api-helpers';
import { translateMutationErrors, chunk } from './lib/nr-graphql-helpers';

import Quickstart, { QuickstartMutationResponse } from './lib/Quickstart';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import {
  prop,
  passedProcessArguments,
  getRelatedQuickstarts,
  getComponentLocalPath,
} from './lib/helpers';

import { QUICKSTART_CONFIG_REGEXP, COMPONENT_PREFIX_REGEXP } from './constants';
import {
  NerdGraphResponseWithLocalErrors,
  NerdGraphError,
} from './types/nerdgraph';

type ResponseWithErrors =
  NerdGraphResponseWithLocalErrors<QuickstartMutationResponse> & {
    name: string;
  };

// filter out errors where install plan id does not exist
const installPlanErrorExists = (error: Error | NerdGraphError): boolean =>
  'extensions' in error &&
  error?.extensions?.argumentPath?.includes('installPlanStepIds') &&
  error?.message?.includes('contains an install plan step that does not exist');

export const countAndOutputErrors = (
  graphqlResponses: ResponseWithErrors[]
): number =>
  graphqlResponses.reduce((all, { errors, name }) => {
    const installPlanErrors =
      (errors?.filter(installPlanErrorExists) as NerdGraphError[]) ?? [];
    const remainingErrors =
      errors?.filter((error) => !installPlanErrorExists(error)) ?? [];

    translateMutationErrors(remainingErrors, name, installPlanErrors);
    return all + remainingErrors.length;
  }, 0);

export const createValidateQuickstarts = async (
  ghUrl?: string,
  ghToken?: string,
  isDryRun = false
): Promise<boolean> => {
  if (!ghToken) {
    console.error('GITHUB_TOKEN is not defined.');
    return false;
  }

  if (!ghUrl) {
    console.error('Github PR URL is not defined.');
    return false;
  }

  // Get all files from PR
  const files = await fetchPaginatedGHResults(ghUrl, ghToken);

  // Get all quickstart mutation variables
  const quickstarts = filterOutTestFiles(files)
    .filter((file) => !isFileRemoved(file))
    .map(prop('filename'))
    .filter(
      (filePath) =>
        QUICKSTART_CONFIG_REGEXP.test(filePath) ||
        COMPONENT_PREFIX_REGEXP.test(filePath)
    )
    .flatMap((filePath) => {
      if (QUICKSTART_CONFIG_REGEXP.test(filePath)) {
        return new Quickstart(filePath);
      }

      return getRelatedQuickstarts(getComponentLocalPath(filePath));
    })
    // Remove any duplicate quickstarts
    .reduce<Quickstart[]>((acc, quickstart) => {
      if (!acc.some((a) => a.configPath === quickstart.configPath)) {
        return [...acc, quickstart];
      }

      return acc;
    }, []);

  const invalidQuickstarts = quickstarts
    .map((qs) => {
      qs.validate();
      return !qs.isValid ? qs : undefined;
    })
    .filter(Boolean);

  if (invalidQuickstarts.length > 0) {
    process.exit(1);
  }

  // Submit all of the mutations in chunks of 5
  let results: ResponseWithErrors[] = [];

  // Class implementations may throw an error
  const quickstartErrors: string[] = [];

  for (const c of chunk(quickstarts, 5)) {
    try {
      const res = await Promise.all(
        c.map((quickstart) => quickstart.submitMutation(isDryRun))
      );

      results = [...results, ...res];
    } catch (err) {
      const error = err as Error;

      quickstartErrors.push(error.message);
    }
  }

  const failures = results.filter((r) => r.errors && r.errors.length);

  const errorCount = countAndOutputErrors(failures);

  quickstartErrors.forEach((errorMessage) => console.error(errorMessage));

  const hasFailed = errorCount > 0 || quickstartErrors.length > 0;

  return hasFailed;
};

const main = async () => {
  const [ghUrl, isDryRun] = passedProcessArguments();
  const ghToken = process.env.GITHUB_TOKEN;
  const dryRun = isDryRun === 'true';
  const hasFailed = await createValidateQuickstarts(ghUrl, ghToken, dryRun);

  // Record event in New Relic
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_QUICKSTARTS
    : CUSTOM_EVENT.UPDATE_QUICKSTARTS;

  await recordNerdGraphResponse(hasFailed, event);

  if (hasFailed) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
