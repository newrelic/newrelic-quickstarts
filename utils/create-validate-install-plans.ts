import { InstallPlanMutationVariable } from './types/InstallPlanMutationVariables';
import { passedProcessArguments } from './helpers';
import { fetchPaginatedGHResults } from './github-api-helpers';
import {
  fetchNRGraphqlResults,
  translateMutationErrors,
  chunk,
} from './nr-graphql-helpers';
import { track, CUSTOM_EVENT } from './newrelic/customEvent';
import InstallPlan from './lib/InstallPlan';

const gql = String.raw;

const INSTALL_CONFIG_REGEXP = new RegExp('install/.+/install.+(yml|yaml)');

export const INSTALL_PLAN_MUTATION = gql`
  # gql
  mutation QuickstartRepoInstallPlanMutation(
    $description: String!
    $dryRun: Boolean
    $displayName: String!
    $fallback: Nr1CatalogInstallPlanDirectiveInput
    $heading: String!
    $id: ID!
    $primary: Nr1CatalogInstallPlanDirectiveInput!
    $target: Nr1CatalogInstallPlanTargetInput!
  ) {
    nr1CatalogSubmitInstallPlanStep(
      dryRun: $dryRun
      installPlanStep: {
        description: $description
        displayName: $displayName
        fallback: $fallback
        heading: $heading
        id: $id
        primary: $primary
        target: $target
      }
    ) {
      installPlanStep {
        id
      }
    }
  }
`;

interface InstallPlanMutationResponse {
  installPlanStep: {
    id: string;
  };
}

/**
 * Send a custom New Relic event recoreding the success status and whether or
 * not this was a dry-run attempt.
 */
const recordCustomNREvent = async (hasFailed: boolean, isDryRun: boolean) => {
  const status = hasFailed ? 'failed' : 'success';
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_INSTALL_PLANS
    : CUSTOM_EVENT.UPDATE_INSTALL_PLANS;

  await track(event, { status });
};

/**
 * Helper function to return a specific property of an object given a key.
 * Intended to be used in with array methods.
 *
 * @todo Move to helper file.
 *
 * @example
 * const people = [{ name: 'Luke', color: 'blue' }, { name: 'Vader', color: 'red' }];
 * const names = people.map(prop('name'));
 */
const prop =
  <T, K extends keyof T>(key: K) =>
  (obj: T) =>
    obj[key];

/**
 * Submits a mutation to NerdGraph for a single install plan.
 *
 * @todo Consider moving this to the InstallPlan class.
 */
const submitMutation = async (variables: InstallPlanMutationVariable) => {
  const { data, errors } = await fetchNRGraphqlResults<
    InstallPlanMutationVariable,
    InstallPlanMutationResponse
  >({
    queryString: INSTALL_PLAN_MUTATION,
    variables,
  });

  return { name: variables.displayName, data, errors };
};

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
  const installPlanMutationVariables = files
    .map(prop('filename'))
    .filter(INSTALL_CONFIG_REGEXP.test)
    .map((filename) => new InstallPlan(filename))
    .map((plan) => plan.getComponentMutationVariables(isDryRun));

  // Submit all of the mutations (in chunks of 5)
  const results = await Promise.all(
    chunk(installPlanMutationVariables, 5).flatMap((chunk) =>
      chunk.map(submitMutation)
    )
  );

  // Find the failed mutations and report
  const failures = results.filter((r) => r.errors && r.errors.length);

  failures.forEach(({ errors, name }) =>
    translateMutationErrors(errors!, name)
  );

  const hasFailed = failures.length > 0;

  await recordCustomNREvent(hasFailed, isDryRun);

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
