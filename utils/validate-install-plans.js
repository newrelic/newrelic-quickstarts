const path = require('path');
const { readYamlFile, pathsToSanitize } = require('./helpers');
const {
  fetchPaginatedGHResults,
  filterInstallPlans,
} = require('./github-api-helpers');

const {
  fetchNRGraphqlResults,
  translateMutationErrors,
} = require('./nr-graphql-helpers');

const url = pathsToSanitize[0];

const VALIDATE_INSTALL_PLAN_MUTATION = `# gql 
mutation (
  $description: String!
  $displayName: String!
  $fallback: Nr1CatalogInstallPlanDirectiveInput
  $heading: String!
  $id: ID!
  $primary: Nr1CatalogInstallPlanDirectiveInput!
  $target: Nr1CatalogInstallPlanTargetInput!
) {
  nr1CatalogSubmitInstallPlanStep(
    dryRun: true
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

const transformInstallPlanTarget = (target) => {
  return Object.entries(target).reduce((acc, [key, value]) => {
    if (key === 'os') {
      acc[key] = value.map((str) => str.toUpperCase());
    } else {
      acc[key] = value.toUpperCase();
    }
    return acc;
  }, {});
};

const transformInstallPlanDirective = ({ mode, destination }) => {
  switch (mode) {
    case 'targetedInstall':
      return {
        mode: 'TARGETED',
        destination: destination && destination.recipeName,
      };
    case 'link':
      return { mode: 'LINK', destination: destination && destination.url };
    case 'nerdlet':
      return {
        mode: 'NERDLET',
        destination: destination && destination.nerdletId,
      };
    default:
      return { mode, destination: undefined };
  }
};

const transformContentsToRequest = ({
  id,
  name,
  title,
  description,
  target,
  install,
  fallback,
}) => {
  return {
    id,
    description,
    displayName: name,
    heading: title,
    target: target ? transformInstallPlanTarget(target) : undefined,
    primary: install ? transformInstallPlanDirective(install) : undefined,
    fallback: fallback ? transformInstallPlanDirective(fallback) : undefined,
  };
};

const transformInstallPlansToRequestVariables = ({ filename }) => {
  const { contents, path: filePath } = readYamlFile(
    path.join(process.cwd(), `../${filename}`)
  );

  return {
    filePath,
    variables: transformContentsToRequest(contents[0]),
  };
};

const validateInstallPlan = async (files) => {
  const installFiles = filterInstallPlans(files).map(
    transformInstallPlansToRequestVariables
  );

  const graphqlResponses = await Promise.all(
    installFiles.map(async ({ variables, filePath }) => {
      const { data, errors } = await fetchNRGraphqlResults({
        queryString: VALIDATE_INSTALL_PLAN_MUTATION,
        variables,
      });
      return { data, filePath, errors };
    })
  );

  let hasFailed = false;

  graphqlResponses.forEach(({ errors, filePath }) => {
    if (errors && errors.length > 0) {
      hasFailed = true;
      translateMutationErrors(errors, filePath);
    }
  });

  return hasFailed;
};

const main = async () => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  const hasFailed = await validateInstallPlan(files);

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = {
  validateInstallPlan,
  VALIDATE_INSTALL_PLAN_MUTATION,
};
