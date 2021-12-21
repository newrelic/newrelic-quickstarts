'use strict';
const { fetchPaginatedGHResults } = require('./github-api-helpers');
const { findMainQuickstartConfigFiles } = require('./helpers')
const path = require('path');
const glob = require('glob');
const { get } = require('http');

const CONFIG_REGEXP = new RegExp('quickstarts/.+/config.+(yml|yaml|json)');
const EXCLUDED_DIRECTORY_PATTERNS = [
  'node_modules/**',
  'utils/**',
  'docs/**',
  '*',
];
const url = process.argv[2];

const getQuickstartFilePaths = (basePath) => {
  const options = {
    ignore: EXCLUDED_DIRECTORY_PATTERNS.map((d) => path.resolve(basePath, d)),
  };

  const yamlFilePaths = [
    ...glob.sync(
      path.resolve(basePath, '../quickstarts/**/config.yaml'),
      options
    ),
    ...glob.sync(
      path.resolve(basePath, '../quickstarts/**/config.yml'),
      options
    ),
  ];

  return yamlFilePaths;
};

const hasConfig = ({ filename }) =>
  (filename.startsWith('quickstarts/') && filename.endsWith('/config.yml')) ||
  (filename.startsWith('quickstarts/') && filename.endsWith('/config.yaml'));

const getQuickstartNode = (filename, target) => {
  const splitFilePath = filename.split('/');
  return splitFilePath[splitFilePath.findIndex((path) => path === target) - 1];
};

const getQuickstartFromFilename = (filename) => {
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
  //   if (filename.includes('/logo.svg')) {
  //     return getQuickstartNode(filename, 'logo.svg');
  //   }
  //   const matches = filename.match(CONFIG_REGEXP);
  //   //   console.log(matches);
  //   if (CONFIG_REGEXP.test(filename)) {
  //     const targetNode = matches[0].split('/').pop();
  //     return getQuickstartNode(filename, targetNode);
  //   }
  // Add conditions for other cases (e.g. logos  or quickstarts with config.yml)
};

const getQuickstartConfigPaths = (quickstartNames) => {
  const allQuickstartConfigPaths = findMainQuickstartConfigFiles()
  
  return quickstartNames.map((quickstartName) => {
    return allQuickstartConfigPaths.find((path) => {
      return path.split("/").includes(quickstartName)
    })
  })
}


const simplifyQuickstartList = (quickstartList) => {
  return [...new Set(quickstartList)];
};

// console.log(getQuickstartFilePaths(process.cwd()).sort());
const getParentQuickstart = (filename) => {
  console.log(filename);
};

Promise.resolve(fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN))
  .then((response) => {
    const uniqueQuickstartConfigs = response
      .filter(hasConfig)
      .map(({ filename }) => filename);

    let uniqueQuickstarts = uniqueQuickstartConfigs.map((filename) => {
      const splitFilePath = filename.split('/');
      return splitFilePath[splitFilePath.length - 2];
    });
    // console.log(uniqueQuickstarts);
    // console.log(uniqueQuickstartConfigs);
    response.forEach(({ filename }) => {
      uniqueQuickstarts.forEach((quickstart) => {
        console.log(`${quickstart}, ${filename}`);
        if (!filename.includes(quickstart)) {
          getParentQuickstart(filename);
        }
      });
    });
    process.exit(0);
  })
  .catch((error) => {
    throw new Error(`Github API returned ${error.message}`);
  });
// path.resolve(basePath, '../quickstarts/**/config.yml');

module.exports = { getQuickstartFromFilename, simplifyQuickstartList, getQuickstartConfigPaths };
