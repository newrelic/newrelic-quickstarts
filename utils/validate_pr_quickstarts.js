'use strict';

const path = require('path');
const glob = require('glob');

const { fetchPaginatedGHResults } = require('./github-api-helpers');
const {
  findMainQuickstartConfigFiles,
  readYamlFile,
  readQuickstartFile,
  removeRepoPathPrefix,
} = require('./helpers');

const GITHUB_REPO_BASE_URL =
  'https://github.com/newrelic/newrelic-quickstarts/tree/main';
const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main';
const EXCLUDED_DIRECTORY_PATTERNS = [
  'node_modules/**',
  'utils/**',
  'docs/**',
  '*',
];
const url = process.argv[2];

const hasConfig = ({ filename }) =>
  (filename.startsWith('quickstarts/') && filename.endsWith('/config.yml')) ||
  (filename.startsWith('quickstarts/') && filename.endsWith('/config.yaml'));

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

  return quickstartNames.map((quickstartName) => {
    return allQuickstartConfigPaths.find((path) => {
      return path.split('/').includes(quickstartName);
    });
  });
};

const getYamlContents = (configPaths) => {
  return configPaths.map((configPath) => readYamlFile(configPath));
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
  } = quickstartConfig.contents[0];
  const alertConfigPaths = getQuickstartAlertsConfigs(quickstartConfig.path);
  const dashboardConfigPaths = getQuickstartDashboardConfigs(
    quickstartConfig.path
  );

  return {
    dryRun: true,
    id: id,
    quickstartMetadata: {
      alertConditions: adaptQuickstartAlertsInput(alertConfigPaths),
      authors: authors.map((author) => {
        return { name: author };
      }),
      categoryTerms: categoryTerms || keywords,
      description: description.trim(),
      displayName: title.trim(),
      documentation: adaptQuickstartDocumentationInput(documentation),
      icon: `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
        quickstartConfig.path
      )}/${logo}`,
      keywords: keywords || null,
      sourceUrl: `${GITHUB_REPO_BASE_URL}/${getQuickstartRelativePath(
        quickstartConfig.path
      )}`,
      summary: summary.trim(),
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

const adaptQuickstartAlertsInput = (alertConfigPaths) => {
  if (alertConfigPaths.length == 0) {
    return null;
  }

  return alertConfigPaths.map((alertConfigPath) => {
    const parsedConfig = readQuickstartFile(alertConfigPath);
    const { details, name, type } = parsedConfig.contents[0];

    return {
      description: details ? details.trim() : null,
      displayName: name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      type: type.trim(),
    };
  });
};

const getQuickstartDashboardConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*.+(json)`;

  return glob.sync(globPattern);
};

const adaptQuickstartDashboardInput = (dashboardConfigPaths) => {
  if (dashboardConfigPaths.length == 0) {
    return null;
  }

  return dashboardConfigPaths.map((dashboardConfigPath) => {
    const parsedConfig = readQuickstartFile(dashboardConfigPath);
    const { description, name } = parsedConfig.contents[0];
    const screenshotPaths =
      getQuickstartDashboardScreenshotPaths(dashboardConfigPath);
    return {
      description: description ? description.trim() : null,
      displayName: name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      screenshots: screenshotPaths.map(getScreenshotUrl),
    };
  });
};

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

const adaptQuickstartDocumentationInput = (documentation) => {
  if (!documentation) {
    return null;
  }

  return documentation.map((doc) => {
    const { name, url, description } = doc;
    return {
      displayName: name,
      url,
      description,
    };
  });
};

const buildUniqueQuickstartSet = (acc, { filename }) => {
  return getQuickstartFromFilename(filename)
    ? acc.add(getQuickstartFromFilename(filename))
    : acc;
};

const getMutationInputs = (files) => {
  const uniqueQuickstarts = files.reduce(buildUniqueQuickstartSet, new Set());

  // get unique quickstarts

  //get unique quickstarts config paths

  // unique quickstarts.MAP-->
  //parse file from path via readQuickstartFile
  //buildMutationVariables(parsedfile)
  //returns an array of mutation input objects
};

const main = async () => {
  const files = await fetchPaginatedGHResults(
    url,
    process.env.GITHUB_TOKEN
  ).catch((error) => {
    throw new Error(`Github API returned: ${error.message}`);
  });

  const mutationInputs = getMutationInputs(files);

  // TODO: Map through array of input objects
  //run mutation (promise.all?)

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

// Promise.resolve(fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN))
//   .then((response) => {
//     const uniqueQuickstartConfigs = response
//       .filter(hasConfig)
//       .map(({ filename }) => filename);

//     let uniqueQuickstarts = uniqueQuickstartConfigs.map((filename) => {
//       const splitFilePath = filename.split('/');
//       return splitFilePath[splitFilePath.length - 2];
//     });
//     response.forEach(({ filename }) => {
//       uniqueQuickstarts.forEach((quickstart) => {
//         console.log(`${quickstart}, ${filename}`);
//         if (!filename.includes(quickstart)) {
//           getParentQuickstart(filename);
//         }
//       });
//     });
//   process.exit(0);
// })
// .catch((error) => {
//   throw new Error(`Github API returned ${error.message}`);
// });

module.exports = {
  getQuickstartFromFilename,
  getQuickstartConfigPaths,
  getYamlContents,
  buildMutationVariables,
  buildUniqueQuickstartSet,
};
