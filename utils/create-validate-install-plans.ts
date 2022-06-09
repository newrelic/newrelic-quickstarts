import { prop, passedProcessArguments } from './helpers';
import { fetchPaginatedGHResults } from './github-api-helpers';
import { translateMutationErrors, chunk } from './nr-graphql-helpers';
import { recordNerdGraphResponse, CUSTOM_EVENT } from './newrelic/customEvent';
import InstallPlan from './lib/InstallPlan';

const INSTALL_CONFIG_REGEXP = new RegExp('install/.+/install.+(yml|yaml)');

/**
 * Entrypoint.
 */
const main = async () => {
  const [GITHUB_API_URL, dryRun] = passedProcessArguments();
  const githubToken = process.env.GITHUB_TOKEN;
  const isDryRun = dryRun === 'true';

  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  // Get all files from PR
  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);

  // Get all install-plan mutation variables
  const plans = files
    .map(prop('filename'))
    .filter(INSTALL_CONFIG_REGEXP.test)
    .map((filename) => new InstallPlan(filename));

  // Submit all of the mutations (in chunks of 5)
  const results = await Promise.all(
    chunk(plans, 5).flatMap((chunk) =>
      chunk.map((plan) => plan.submitMutation(isDryRun))
    )
  );

  // Find the failed mutations and report
  const failures = results.filter((r) => r.errors && r.errors.length);

  failures.forEach(({ errors, name }) =>
    translateMutationErrors(errors!, name)
  );

  const hasFailed = failures.length > 0;

  // Record event in New Relic
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_INSTALL_PLANS
    : CUSTOM_EVENT.UPDATE_INSTALL_PLANS;

  await recordNerdGraphResponse(hasFailed, event);

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
