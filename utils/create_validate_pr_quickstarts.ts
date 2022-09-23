import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
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
import { NerdGraphResponseWithLocalErrors } from './types/nerdgraph';

const main = async () => {
  const [GITHUB_API_URL, isDryRun] = passedProcessArguments();
  const githubToken = process.env.GITHUB_TOKEN;
  const dryRun = isDryRun === 'true';

  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  // Get all files from PR
  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);

  // Get all quickstart mutation variables
  const quickstarts = filterOutTestFiles(files)
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
  let results: (NerdGraphResponseWithLocalErrors<QuickstartMutationResponse> & {
    name: string;
  })[] = [];

  // Class implementations may throw an error
  const quickstartErrors: string[] = [];

  for (const c of chunk(quickstarts, 5)) {
    try {
      const res = await Promise.all(
        c.map((quickstart) => quickstart.submitMutation(dryRun))
      );

      results = [...results, ...res];
    } catch (err) {
      const error = err as Error;

      quickstartErrors.push(error.message);
      return [];
    }
  }

  const failures = results.filter((r) => r.errors && r.errors.length);

  failures.forEach(({ errors, name }) =>
    translateMutationErrors(errors!, name)
  );

  quickstartErrors.forEach((errorMessage) => console.error(errorMessage));

  const hasFailed = failures.length > 0 || quickstartErrors.length > 0;

  // Record event in New Relic
  const event = dryRun
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
