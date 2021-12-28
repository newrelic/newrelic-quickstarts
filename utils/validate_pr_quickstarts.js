'use strict';

const glob = require('glob');

const { fetchPaginatedGHResults } = require('./github-api-helpers');
const {
  findMainQuickstartConfigFiles,
  readQuickstartFile,
  removeRepoPathPrefix,
} = require('./helpers');
const {
  fetchNRGraphqlResults,
  translateMutationErrors,
} = require('./nr-graphql-helpers');

const GITHUB_REPO_BASE_URL =
  'https://github.com/newrelic/newrelic-quickstarts/tree/main';
const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main';

const NR_API_URL = process.env.NR_API_URL;
const NR_API_TOKEN = process.env.NR_API_TOKEN;

const VALIDATE_QUICKSTART_MUTATION = `# gql
mutation (
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

const EXCLUDED_DIRECTORY_PATTERNS = [
  'node_modules/**',
  'utils/**',
  'docs/**',
  '*',
];
const url = process.argv[2];

const getQuickstartNode = (filename, target) => {
  const splitFilePath = filename.split('/');
  return splitFilePath[splitFilePath.findIndex((path) => path === target) - 1];
};

const getQuickstartFromFilename = (filename) => {
  if (
    !filename.includes('quickstarts/') &&
    !filename.includes('mock_quickstarts/')
  ) {
    return;
  }

  if (filename.includes('/alerts/')) {
    return getQuickstartNode(filename, 'alerts');
  }

  if (filename.includes('/dashboards/')) {
    return getQuickstartNode(filename, 'dashboards');
  }

  if (filename.includes('/images/')) {
    return getQuickstartNode(filename, 'images');
  }

  const targetFileName = filename.split('/').pop();

  return getQuickstartNode(filename, targetFileName);
};

const getQuickstartConfigPaths = (quickstartNames) => {
  const allQuickstartConfigPaths = findMainQuickstartConfigFiles();

  return quickstartNames.reduce((acc, quickstartName) => {
    const match = allQuickstartConfigPaths.find((path) => {
      return path.split('/').includes(quickstartName);
    });
    if (match) {
      acc.push(match);
    }

    return acc;
  }, []);
};

const buildMutationVariables = (quickstartConfig) => {
  const {
    authors,
    categoryTerms,
    description,
    title,
    documentation,
    logo,
    keywords,
    summary,
    installPlans,
    id,
  } = quickstartConfig.contents[0] || {};
  const alertConfigPaths = getQuickstartAlertsConfigs(quickstartConfig.path);
  const dashboardConfigPaths = getQuickstartDashboardConfigs(
    quickstartConfig.path
  );

  return {
    dryRun: true,
    id: id,
    quickstartMetadata: {
      alertConditions: adaptQuickstartAlertsInput(alertConfigPaths),
      authors: authors && authors.map((author) => ({ name: author })),
      categoryTerms: categoryTerms || keywords,
      description: description && description.trim(),
      displayName: title && title.trim(),
      documentation: adaptQuickstartDocumentationInput(documentation),
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
      installPlanStepIds: installPlans,
      dashboards: adaptQuickstartDashboardInput(dashboardConfigPaths),
    },
  };
};

const getQuickstartRelativePath = (configPath) => {
  const splitConfigPath = configPath.split('/');
  splitConfigPath.pop();
  return removeRepoPathPrefix(splitConfigPath.join('/'));
};

const getQuickstartAlertsConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/alerts/*.+(yml|yaml)`;

  return glob.sync(globPattern);
};

const adaptQuickstartAlertsInput = (alertConfigPaths) =>
  alertConfigPaths.length > 0
    ? alertConfigPaths.map((alertConfigPath) => {
        const parsedConfig = readQuickstartFile(alertConfigPath);
        const { details, name, type } = parsedConfig.contents[0];

        return {
          description: details && details.trim(),
          displayName: name && name.trim(),
          rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
          type: type && type.trim(),
        };
      })
    : undefined;

const getQuickstartDashboardConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*.+(json)`;

  return glob.sync(globPattern);
};

const adaptQuickstartDashboardInput = (dashboardConfigPaths) =>
  dashboardConfigPaths.length > 0
    ? dashboardConfigPaths.map((dashboardConfigPath) => {
        const parsedConfig = readQuickstartFile(dashboardConfigPath);
        const { description, name } = parsedConfig.contents[0];
        const screenshotPaths =
          getQuickstartDashboardScreenshotPaths(dashboardConfigPath);
        return {
          description: description && description.trim(),
          displayName: name && name.trim(),
          rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
          screenshots: screenshotPaths && screenshotPaths.map(getScreenshotUrl),
        };
      })
    : undefined;

const getScreenshotUrl = (path) => {
  const screenshotFilename = path.split('/').pop();

  return {
    url: `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
      path
    )}/${screenshotFilename}`,
  };
};

const getQuickstartDashboardScreenshotPaths = (dashboardConfigPath) => {
  const splitConfigPath = dashboardConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/*.+(jpeg|jpg|png)`;

  return glob.sync(globPattern);
};

const adaptQuickstartDocumentationInput = (documentation) =>
  documentation &&
  documentation.map((doc) => {
    const { name, url, description } = doc;
    return {
      displayName: name,
      url,
      description,
    };
  });

const buildUniqueQuickstartSet = (acc, { filename }) => {
  return getQuickstartFromFilename(filename)
    ? acc.add(getQuickstartFromFilename(filename))
    : acc;
};

const getGraphqlRequests = (files) => {
  const uniqueQuickstarts = files.reduce(buildUniqueQuickstartSet, new Set());

  const quickstartConfigPaths = getQuickstartConfigPaths([
    ...uniqueQuickstarts,
  ]);

  return quickstartConfigPaths.map((configPath) => ({
    filePath: removeRepoPathPrefix(configPath),
    variables: buildMutationVariables(readQuickstartFile(configPath)),
  }));
};

const main = async () => {
  const files = await fetchPaginatedGHResults(
    url,
    process.env.GITHUB_TOKEN
  ).catch((error) => {
    throw new Error(`GitHub API returned: ${error.message}`);
  });

  const graphqlRequests = getGraphqlRequests(files);

  const graphqlResponses = await Promise.all(
    graphqlRequests.map(async ({ variables, filePath }) => {
      const { data, errors } = await fetchNRGraphqlResults(
        {
          queryString: VALIDATE_QUICKSTART_MUTATION,
          variables,
        },
        NR_API_URL,
        NR_API_TOKEN
      );

      return { data, errors, filePath };
    })
  );

  let hasFailed = false;

  graphqlResponses.forEach(({ errors, filePath }) => {
    if (errors.length > 0) {
      hasFailed = true;
      translateMutationErrors(errors, filePath);
    }
  });

  if (hasFailed) {
    process.exit(1);
  }

  process.exit(0);
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
};
