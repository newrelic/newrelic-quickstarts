import { fetchPaginatedGHResults } from './github-api-helpers';
import { prop, passedProcessArguments } from './helpers';
import { translateMutationErrors, chunk } from './nr-graphql-helpers';

import Quickstart from './lib/Quickstart';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';

const QUICKSTART_CONFIG_REGEXP = new RegExp(/quickstarts\/.*\/config.+(yml|yaml)/gm);

console.log(QUICKSTART_CONFIG_REGEXP);

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
  const quickstarts = files
    .map(prop('filename'))
    .filter((filePath) => QUICKSTART_CONFIG_REGEXP.test(filePath))
    .map((config) => new Quickstart(config));

  // Submit all of the mutations in chunks of 5
  const results = await Promise.all(
    chunk(quickstarts, 5).flatMap((chunk) =>
      chunk.map((quickstart) => quickstart.submitMutation(dryRun))
    )
  );

  const failures = results.filter((r) => r.errors && r.errors.length);

  failures.forEach(({ errors, name }) =>
    translateMutationErrors(errors!, name)
  );

  const hasFailed = failures.length > 0;

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
