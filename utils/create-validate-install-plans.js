'use strict';
const path = require('path');
const { readYamlFile, passedProcessArguments } = require('./helpers');
const {
  fetchPaginatedGHResults,
  filterInstallPlans,
} = require('./github-api-helpers');

const {
  fetchNRGraphqlResults,
  translateMutationErrors,
  chunk,
} = require('./nr-graphql-helpers');
const { track, CUSTOM_EVENT } = require('./newrelic/customEvent');

const INSTALL_PLAN_MUTATION = `# gql
mutation QuickstartRepoInstallPlanMutation (
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

/**
 * Builds the target parameter from the config into the variables for NR Request
 * @param {Object} target the `target` parameter object
 * @returns {Object} target transformed for NR request
 */
const buildInstallPlanTargetVariable = (target) => {
  return Object.entries(target).reduce((acc, [key, value]) => {
    if (key === 'os') {
      acc[key] = value.map((str) => str.toUpperCase());
    } else {
      acc[key] = value.toUpperCase();
    }
    return acc;
  }, {});
};

/**
 * Builds the target parameter from the config into the variables for NR Request
 * @param {{mode, destination}} directive `install` or `fallback` parameter object
 * @returns {{mode, destination}} directive transformed for NR request
 */
const buildInstallPlanDirectiveVariable = ({ mode, destination }) => {
  switch (mode) {
    case 'targetedInstall':
      return {
        targeted: { recipeName: destination && destination.recipeName },
      };
    case 'link':
      return { link: { url: destination && destination.url } };
    case 'nerdlet':
      return {
        nerdlet: {
          nerdletId: destination && destination.nerdletId,
          nerdletState: destination && JSON.stringify(destination.nerdletState),
        },
      };
    default:
      return { mode, destination: undefined };
  }
};

/**
 * Builds input argument for submitQuickstart GraphQL mutation.
 * @param {Object} installPlanConfig - An object containing the path and contents of a quickstart config file.
 * @return {Object} An object that represents a quickstart in the context of a GraphQL mutation.
 */
const buildMutationVariables = (installPlanConfig) => {
  const { id, title, description, target, install, fallback } =
    installPlanConfig.contents[0] || {};

  const dryRun = passedProcessArguments()[1] === 'true';

  return {
    id,
    dryRun,
    description,
    displayName: title,
    heading: title,
    target: target && buildInstallPlanTargetVariable(target),
    primary: install && buildInstallPlanDirectiveVariable(install),
    fallback: fallback && buildInstallPlanDirectiveVariable(fallback),
  };
};

/**
 * Takes the filenames and returns path and request variables for file for submitInstallPlan mutation.
 * @param {{filename}} file - An object containing the filename of install plan config file.
 * @return {{filePath, variables}} - An object containing the path and mutation variables for install plan.
 */
const transformInstallPlansToRequestVariables = ({ filename }) => {
  const installPlanFile = readYamlFile(
    path.join(process.cwd(), `../${filename}`)
  );

  return {
    filePath: installPlanFile.path,
    variables: buildMutationVariables(installPlanFile),
  };
};

/**
 * Validates for an array of install plan filenames
 * @param {Array} installPlanFiles - Array containing install plan file names.
 * @return {Promise.<Boolean>} - Boolean value indicating whether all files were validated
 */
const createValidateUpdateInstallPlan = async (installPlanFiles) => {
  const installPlanRequests = installPlanFiles.map(
    transformInstallPlansToRequestVariables
  );
  const chunkedInstallPlanRequests = chunk(installPlanRequests, 5); // Run requests in groups of 5

  let graphqlResponses = [];
  // using a For Of loop so that it respects the `await`
  for (const reqChunk of chunkedInstallPlanRequests) {
    const chunkRes = await Promise.all(
      reqChunk.map(async ({ variables, filePath }) => {
        const { data, errors } = await fetchNRGraphqlResults({
          queryString: INSTALL_PLAN_MUTATION,
          variables,
        });

        return { data, filePath, errors };
      })
    );
    graphqlResponses = [...graphqlResponses, ...chunkRes];
  }

  let hasFailed = false;

  graphqlResponses.forEach(({ errors, filePath }) => {
    if (errors && errors.length > 0) {
      hasFailed = true;
      translateMutationErrors(errors, filePath);
    }
  });

  return hasFailed;
};

/**
 * @param {boolean} hasFailed if the validation or submission has failed
 * @param {boolean} isDryRun - true for validation, false for submission
 */
const recordCustomNREvent = async (hasFailed, isDryRun) => {
  const status = hasFailed ? 'failed' : 'success';
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_INSTALL_PLANS
    : CUSTOM_EVENT.UPDATE_INSTALL_PLANS;

  await track(event, { status });
};

const main = async () => {
  const [GITHUB_API_URL, isDryRun] = passedProcessArguments();

  const files = await fetchPaginatedGHResults(
    GITHUB_API_URL,
    process.env.GITHUB_TOKEN
  );
  const installPlanFiles = filterInstallPlans(files);
  const hasFailed = await createValidateUpdateInstallPlan(installPlanFiles);
  await recordCustomNREvent(hasFailed, isDryRun === 'true');

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = {
  createValidateUpdateInstallPlan,
  INSTALL_PLAN_MUTATION,
};
