const { readYamlFile, pathsToSanitize } = require('./helpers');
const {
  fetchPaginatedGHResults,
  filterInstallPlans,
} = require('./github-api-helpers');

const NR_API_URL = process.env.NR_API_URL;
const NR_API_TOKEN = process.env.NR_API_TOKEN;

const url = pathsToSanitize[0];

const VALIDATE_INSTALL_PLAN_MUTATION = `# gql 
mutation (
  $dryRun: Boolean
  $description: String!
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
      description
      displayName
      fallback {
        mode
      }
      heading
      id
      primary {
        mode
      }
      target {
        destination
        os
        type
      }
    }
  }
}
`;

const validateInstallPlanSchema = (files) => {
  const configFiles = filterInstallPlans(files);
};

const main = async () => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  console.log(files);
};

if (require.main === module) {
  main();
}
