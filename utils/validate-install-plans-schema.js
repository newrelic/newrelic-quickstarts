const path = require('path');
const { readYamlFile, pathsToSanitize } = require('./helpers');
const {
  fetchPaginatedGHResults,
  filterInstallPlans,
} = require('./github-api-helpers');
const { fetchNRGraphqlResults } = require('./nr-graphql-helpers');

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

const TARGET_ENUM_KEYS = ['type', 'destination'];

const capitalizeEnums = (obj, transformKeys = ['mode']) => {
  return Object.keys(obj).reduce((acc, key) => {
    if (transformKeys.includes(key)) {
      const value = obj[key] === 'targetedInstall' ? 'install' : obj[key];
      acc[key] = value.toUpperCase();
    } else if (key === 'os') {
      acc[key] = obj[key].map((str) => str.toUpperCase());
    }
    return acc;
  }, obj);
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
    dryRun: true,
    id,
    displayName: name,
    heading: title,
    description,
    target: capitalizeEnums(target, TARGET_ENUM_KEYS),
    primary: capitalizeEnums(install),
    fallback: capitalizeEnums(fallback),
  };
};

const validateInstallPlanSchema = async (files) => {
  const installFiles = filterInstallPlans(files);
  const installFilesContents = installFiles.map(({ filename }) =>
    readYamlFile(path.join(process.cwd(), `../${filename}`))
  );
  const transformedFiles = installFilesContents.map(({ contents, path }) => ({
    requestVariables: transformContentsToRequest(contents[0]),
    path,
  }));

  const response = await Promise.all(
    transformedFiles.map(async ({ requestVariables }) => {
      const res = await fetchNRGraphqlResults(
        {
          queryString: VALIDATE_INSTALL_PLAN_MUTATION,
          variables: requestVariables,
        },
        NR_API_URL,
        NR_API_TOKEN
      );
      return res;
    })
  );
  console.log(response);
};

const main = async () => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  await validateInstallPlanSchema(files);
};

if (require.main === module) {
  main();
}
