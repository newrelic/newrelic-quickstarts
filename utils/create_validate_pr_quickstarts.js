'use strict';

const glob = require('glob');

const {
  fetchPaginatedGHResults,
  filterOutTestFiles,
} = require('./github-api-helpers');
const {
  findMainQuickstartConfigFiles,
  readQuickstartFile,
  removeRepoPathPrefix,
  passedProcessArguments,
} = require('./helpers');
const {
  fetchNRGraphqlResults,
  translateMutationErrors,
  getCategoryTermsFromKeywords,
  chunk,
} = require('./nr-graphql-helpers');

const GITHUB_REPO_BASE_URL =
  'https://github.com/newrelic/newrelic-quickstarts/tree/main';
const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main';
const QUICKSTART_MUTATION = `# gql
mutation QuickstartRepoQuickstartMutation (
  $dryRun: Boolean
  $id: ID!
  $quickstartMetadata: Nr1CatalogQuickstartMetadataInput!
) {
    nr1CatalogSubmitQuickstart(
      dryRun: $dryRun
      id: $id
      quickstartMetadata: $quickstartMetadata
    ) {
        quickstart {
          id
        }
      }
  }
`;
/**
 * Because brand new quickstarts added via a PR do not have an ID until they are assigned one at release,
 * this mock UUID allows for validation to take place knowing a different UUID will be used for the actual release.
 */
const MOCK_UUID = '00000000-0000-0000-0000-000000000000';

const SUPPORT_LEVEL_ENUMS = {
  'New Relic': 'NEW_RELIC',
  Community: 'COMMUNITY',
  Verified: 'VERIFIED',
};

/**
 * Gets the unique base quickstart directory from a given file path.
 * e.g. filePath: 'quickstarts/python/aiohttp/alerts/ApdexScore.yml' + targetChild: 'alerts' = 'python/aiohttp'.
 * @param {String} filePath - Full file path of a file in a quickstart.
 * @param {String} targetChild - Node in file path that should be preceded by a base quickstart directory.
 * @return {String} Node in file path of the quickstart.
 */
const getQuickstartNode = (filePath, targetChild) => {
  const splitFilePath = filePath.split('/');

  const baseQuickstartDirectoryIndex =
    splitFilePath.findIndex((path) => path === targetChild) - 1;

  let uniqueQuickstartDirectory = splitFilePath[baseQuickstartDirectoryIndex];
  let indexCounter = baseQuickstartDirectoryIndex;

  while (indexCounter > 1) {
    uniqueQuickstartDirectory = splitFilePath[indexCounter - 1].concat(
      `/${uniqueQuickstartDirectory}`
    );
    indexCounter--;
  }
  return uniqueQuickstartDirectory;
};

/**
 * Identifies where in a given file path to look for a quickstart directory.
 * @param {String} filePath - Full file path of a file in a quickstart.
 * @return {Function|undefined} Called function with arguments to determine the quickstart of a given file path.
 */
const getQuickstartFromFilename = (filePath) => {
  if (!filePath.includes('quickstarts/')) {
    return undefined;
  }

  if (filePath.includes('/alerts/')) {
    return getQuickstartNode(filePath, 'alerts');
  }

  if (filePath.includes('/dashboards/')) {
    return getQuickstartNode(filePath, 'dashboards');
  }

  if (filePath.includes('/images/')) {
    return getQuickstartNode(filePath, 'images');
  }

  const targetChildNode = filePath.split('/').pop();

  return getQuickstartNode(filePath, targetChildNode);
};

/**
 * Looks up corresponding quickstart config files for quickstarts known to have changes in a PR.
 * @param {Set} quickstartDirectories - Set of unique quickstart directories.
 * @return {Array} Collection of config file paths.
 */
const getQuickstartConfigPaths = (quickstartDirectories) => {
  const allQuickstartConfigPaths = findMainQuickstartConfigFiles();

  return Array.from(quickstartDirectories).reduce(
    (acc, quickstartDirectory) => {
      const match = allQuickstartConfigPaths.find((path) =>
        path.includes(`/${quickstartDirectory}/`)
      );
      if (match) {
        acc.push(match);
      }
      return acc;
    },
    []
  );
};

/**
 * Builds input argument for submitQuickstart GraphQL mutation.
 * @param {Object} quickstartConfig - An object containing the path and contents of a quickstart config file.
 * @return {Object} An object that represents a quickstart in the context of a GraphQL mutation.
 */
const buildMutationVariables = (quickstartConfig) => {
  const {
    authors,
    description,
    title,
    documentation,
    logo,
    keywords,
    summary,
    installPlans,
    id,
    level,
  } = quickstartConfig.contents[0] || {};
  const alertConfigPaths = getQuickstartAlertsConfigs(quickstartConfig.path);
  const dashboardConfigPaths = getQuickstartDashboardConfigs(
    quickstartConfig.path
  );

  const dryRun = Boolean(passedProcessArguments()[1] === 'true');

  return {
    id: id ? id : MOCK_UUID,
    dryRun,
    quickstartMetadata: {
      alertConditions:
        alertConfigPaths.length > 0
          ? adaptQuickstartAlertsInput(alertConfigPaths)
          : undefined,
      authors: authors && authors.map((author) => ({ name: author })),
      categoryTerms: getCategoryTermsFromKeywords(keywords),
      description: description && description.trim(),
      displayName: title && title.trim(),
      documentation:
        documentation && adaptQuickstartDocumentationInput(documentation),
      icon:
        logo &&
        `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
          quickstartConfig.path
        )}/${logo}`,
      keywords: keywords,
      sourceUrl: `${GITHUB_REPO_BASE_URL}/${getQuickstartRelativePath(
        quickstartConfig.path
      )}`,
      summary: summary && summary.trim(),
      supportLevel: SUPPORT_LEVEL_ENUMS[level],
      installPlanStepIds: installPlans,
      dashboards:
        dashboardConfigPaths.length > 0
          ? adaptQuickstartDashboardInput(dashboardConfigPaths)
          : undefined,
    },
  };
};

/**
 * Gets the relative path of a quickstart from the root config file path.
 * @param {String} configPath - The file path to the root config file of a quickstart.
 * @return {String} Returns the relative path of a quickstart.
 */
const getQuickstartRelativePath = (configPath) => {
  const splitConfigPath = configPath.split('/');
  splitConfigPath.pop();
  return removeRepoPathPrefix(splitConfigPath.join('/'));
};

/**
 * Gets the file paths of all config files within the `alerts` directory of a quickstart.
 * @param {String} quickstartConfigPath - The file path to the root config file of a quickstart.
 * @return {Array} A set of file-path strings for the config files within the `alerts` directory of a quickstart.
 */
const getQuickstartAlertsConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/alerts/*.+(yml|yaml)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `alertConditions` field.
 * @param {Array} alertConfigPaths - File paths of config files within an `alerts` directory.
 * @return {Array} An set of objects that represent a quickstart's alert conditions in the context of a GraphQL mutation.
 */
const adaptQuickstartAlertsInput = (alertConfigPaths) =>
  alertConfigPaths.map((alertConfigPath) => {
    const parsedConfig = readQuickstartFile(alertConfigPath);
    const { details, name, type } = parsedConfig.contents[0];

    return {
      description: details && details.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      sourceUrl: getAssetSourceUrl(alertConfigPath),
      type: type && type.trim(),
    };
  });

/**
 * Gets the file paths of all config files within the `dashboards` directory of a quickstart.
 * @param {String} quickstartConfigPath - The file path to the root config file of a quickstart.
 * @returns {Array} A set of file-path strings for the config files within the `dashboards` directory of a quickstart.
 */
const getQuickstartDashboardConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*.+(json)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `dashboards` field.
 * @param {Array} dashboardConfigPaths - File paths of config files within a `dashboards` directory.
 * @return {Array} An set of objects that represent a quickstart's dashboards in the context of a GraphQL mutation.
 */
const adaptQuickstartDashboardInput = (dashboardConfigPaths) =>
  dashboardConfigPaths.map((dashboardConfigPath) => {
    const parsedConfig = readQuickstartFile(dashboardConfigPath);
    const { description, name } = parsedConfig.contents[0];
    const screenshotPaths =
      getQuickstartDashboardScreenshotPaths(dashboardConfigPath);
    return {
      description: description && description.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      sourceUrl: getAssetSourceUrl(dashboardConfigPath),
      screenshots: screenshotPaths && screenshotPaths.map(getScreenshotUrl),
    };
  });

/**
 * Creates the GitHub url of each screenshot within the main directory of a quickstart.
 * @param {String} path - The file path of a screenshot.
 * @return {Object} Returns an object containing the GitHub url of a screenshot.
 */
const getScreenshotUrl = (path) => {
  const screenshotFilename = path.split('/').pop();

  return {
    url: `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
      path
    )}/${screenshotFilename}`,
  };
};

/**
 * Creates the GitHub url of an asset within the main directory of a quickstart.
 * @param {String} path - The file path of an asset.
 * @return {Object} Returns an object containing the GitHub url of an asset.
 */
const getAssetSourceUrl = (path) => {
  const assetFilename = path.split('/').pop();

  return `${GITHUB_REPO_BASE_URL}/${getQuickstartRelativePath(
    path
  )}/${assetFilename}`;
};

/**
 * Creates the file path of each screenshot within the dashboard directory of a quickstart.
 * @param {String} dashboardConfigPath - The file path of the config file within a quickstart's `dashboards` directory.
 * @return {Array} A set of file-path strings for any screenshots within the same `dashboards` directory.
 */
const getQuickstartDashboardScreenshotPaths = (dashboardConfigPath) => {
  const splitConfigPath = dashboardConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/*.+(jpeg|jpg|png)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `documentation` field.
 * @param {Array} documentation - The documentation sections of a parsed quickstart config.yml file.
 * @return {Array}  An set of objects that represent a quickstart's documentation in the context of a GraphQL mutation.
 */
const adaptQuickstartDocumentationInput = (documentation) =>
  documentation.map((doc) => {
    const { name, url, description } = doc;
    return {
      displayName: name,
      url,
      description,
    };
  });

/**
 * Reducer function that builds a set of unique quickstarts that were updated in a given PR.
 * @param {Set} acc - A set of unique quickstarts being built by the reducer function.
 * @param {Object} curr - A result from the GitHub API.
 * @return {Set} A set of strings representing the unique quickstarts updated in a PR.
 */
const buildUniqueQuickstartSet = (acc, { filename }) => {
  return getQuickstartFromFilename(filename)
    ? acc.add(getQuickstartFromFilename(filename))
    : acc;
};

/**
 * Creates GraphQL requests to be used in the SubmitQuickstartMetadata mutation.
 * @param {Array} files - A list of all files changed in the PR.
 * @return {Array} Returns objects containing the file path of a quickstart's root config file and the variables used in the submitQuickstart mutation.
 */
const getGraphqlRequests = (files) => {
  const uniqueQuickstarts = files.reduce(buildUniqueQuickstartSet, new Set());
  const quickstartConfigPaths = getQuickstartConfigPaths(uniqueQuickstarts);

  return quickstartConfigPaths.map((configPath) => ({
    filePath: removeRepoPathPrefix(configPath),
    variables: buildMutationVariables(readQuickstartFile(configPath)),
  }));
};

/**
 * Builds and sends GraphQL mutations to validate the quickstarts in a PR and prints out any errors
 * @param {Array} files - A list of all files changed in the PR.
 * @return {Promise.<Boolean>} A value indicating if the GitHub Action should fail
 */
const createValidateUpdateQuickstarts = async (files) => {
  const graphqlRequests = getGraphqlRequests(filterOutTestFiles(files));
  const chunkedRequests = chunk(graphqlRequests, 5); // Run requests in groups of 5

  let graphqlResponses = [];
  // using a For Of loop so that it respects the `await`
  for (const reqChunk of chunkedRequests) {
    const chunkRes = await Promise.all(
      reqChunk.map(async ({ variables, filePath }) => {
        const { data, errors } = await fetchNRGraphqlResults({
          queryString: QUICKSTART_MUTATION,
          variables,
        });

        return { data, errors, filePath };
      })
    );
    graphqlResponses = [...graphqlResponses, ...chunkRes];
  }
  return Boolean(countErrors(graphqlResponses));
};

/**
 * @param {Object[]} graphqlResponses[]
 * @param {Object[]} graphqlResponses[].errors
 * @param {string[]} graphqlResponses[].filePath
 * @returns {number}
 */
const countErrors = (graphqlResponses) => {
  let errorCount = 0;

  graphqlResponses.forEach(({ errors, filePath }) => {
    // filter out errors where install plan id does not exist

    const installPlanErrorExists = (error) =>
      !(
        !error?.extensions?.argumentPath?.includes('installPlanStepIds') ||
        !error?.message?.includes(
          'contains an install plan step that does not exist'
        )
      );

    const installPlanErrors = errors.filter(installPlanErrorExists);
    const remainingErrors = errors.filter(
      (error) => !installPlanErrorExists(error)
    );

    errorCount += remainingErrors.length;

    if (errors.length > 0) {
      translateMutationErrors(remainingErrors, filePath, installPlanErrors);
    }
  });

  return errorCount;
};

const main = async () => {
  const GITHUB_API_URL = passedProcessArguments()[0];

  const files = await fetchPaginatedGHResults(
    GITHUB_API_URL,
    process.env.GITHUB_TOKEN
  );

  const hasFailed = await createValidateUpdateQuickstarts(files);

  if (hasFailed) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}

module.exports = {
  getQuickstartFromFilename,
  getQuickstartConfigPaths,
  buildMutationVariables,
  buildUniqueQuickstartSet,
  getGraphqlRequests,
  countErrors,
};
