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

const transformInstallPlanDirective = ({ destination, mode }) => {
  if (mode === 'targetedInstall') {
    return { mode: 'TARGETED', destination: destination.recipeName };
  } else if (mode === 'link') {
    return { mode: 'LINK', destination: destination.url };
  } else if (mode === 'nerdlet') {
    return { mode: 'NERDLET', destination: destination.nerdletId };
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
    dryRun: true,
    id,
    displayName: name,
    heading: title,
    description,
    target: transformInstallPlanTarget(target),
    primary: transformInstallPlanDirective(install),
    fallback: transformInstallPlanDirective(fallback),
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
