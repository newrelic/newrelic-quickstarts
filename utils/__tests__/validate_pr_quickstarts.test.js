'use strict';
const path = require('path');
const { expect } = require('@jest/globals');
const {
  getQuickstartFromFilename,
  simplifyQuickstartList,
  getQuickstartConfigPaths,
  getYamlContents,
  buildMutationVariables,
} = require('../validate_pr_quickstarts');

const buildFullQuickstartFilePaths = (relativePaths) => {
  return relativePaths.map((relativePath) => {
    return path.resolve(process.cwd(), `..${relativePath}`);
  });
};

const mockFilenames = [
  'quickstarts/python/aiohttp/alerts/ApdexScore.yml',
  'quickstarts/robert-other-test-quickstart-folder/alerts/baseline-alert.yml',
  'quickstarts/robert-other-test-quickstart-folder/alerts/static-alert.yml',
  'quickstarts/robert-other-test-quickstart-folder/config.yml',
  'quickstarts/robert-other-test-quickstart-folder/dashboards/my-dashboard.json',
  'quickstarts/robert-other-test-quickstart-folder/dashboards/my-dashboard.png',
  'quickstarts/robert-other-test-quickstart-folder/icon.jpeg',
  'quickstarts/robert-other-test-quickstart-folder/images/icon.jpeg',
  'quickstarts/robert-other-test-quickstart-folder/logo.png',
  'quickstarts/robert-test-quickstart-folder/alerts/baseline-alert.yml',
  'quickstarts/robert-test-quickstart-folder/alerts/static-alert.yml',
  'quickstarts/robert-test-quickstart-folder/config.yml',
  'quickstarts/robert-test-quickstart-folder/dashboards/my-dashboard.json',
  'quickstarts/robert-test-quickstart-folder/dashboards/my-dashboard.png',
  'quickstarts/robert-test-quickstart-folder/icon.jpeg',
  'quickstarts/robert-test-quickstart-folder/images/icon.jpeg',
  'quickstarts/robert-test-quickstart-folder/logo.png',
  'quickstarts/python/aiohttp/alerts/ApdexScore.yml',
  'quickstarts/python/pysqlite/dashboards/python.json',
  'quickstarts/python/pysqlite/logo.svg',
];

const expectedUniqueQuickstartDirectories = [
  'aiohttp',
  'robert-other-test-quickstart-folder',
  'robert-test-quickstart-folder',
  'pysqlite',
];

const quickstartNames = [
  'aws-ec2',
  'infrastructure',
  'aiohttp',
  'pysqlite',
  'postgresql',
];

const quickstartConfigRelativePaths = [
  '/quickstarts/aws/aws-ec2/config.yml',
  '/quickstarts/infrastructure/config.yml',
  '/quickstarts/python/aiohttp/config.yml',
  '/quickstarts/python/pysqlite/config.yml',
  '/quickstarts/postgresql/config.yml',
];

const expectedQuickstartConfigFullPaths = buildFullQuickstartFilePaths(
  quickstartConfigRelativePaths
);

describe('getQuickstartFromFilename', () => {
  test('returns the quickstart an alert belongs to', () => {
    expect(
      getQuickstartFromFilename(
        'quickstarts/python/aiohttp/alerts/ApdexScore.yml'
      )
    ).toEqual('aiohttp');
  });

  test('returns the quickstart a dashboard belongs to', () => {
    expect(
      getQuickstartFromFilename(
        'quickstarts/python/pysqlite/dashboards/python.json'
      )
    ).toEqual('pysqlite');
  });

  test('returns the quickstart a logo belongs to', () => {
    expect(
      getQuickstartFromFilename('quickstarts/python/pysqlite/logo.svg')
    ).toEqual('pysqlite');
  });

  test('returns a list of unique quickstarts', () => {
    const simplifiedList = simplifyQuickstartList(
      mockFilenames.map(getQuickstartFromFilename)
    );
    expect(simplifiedList).toEqual(expectedUniqueQuickstartDirectories);
  });

  test('returns list of unique quickstart config filepaths', () => {
    const foundConfigPaths = getQuickstartConfigPaths(quickstartNames);
    expect(foundConfigPaths).toEqual(expectedQuickstartConfigFullPaths);
  });

  test('returns list of config content for each config filepath', () => {
    const configContent = getYamlContents(expectedQuickstartConfigFullPaths);
    expect(configContent).toEqual([]);
  });
});
