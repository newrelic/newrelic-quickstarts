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
const { readQuickstartFile } = require('../helpers');

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

const expectedMockQuickstart2MutationInput = {
  authors: [{ name: 'John Smith' }],
  categoryTerms: ['list', 'of', 'searchable', 'keywords'],
  description:
    'The template quickstart allows you to get visibility into the performance and available of your example service and dependencies. Use this quickstart together with the mock up integrations.',
  displayName: 'Template Quickstart',
  documentation: [
    {
      displayName: 'Installation Docs',
      url: 'docs.newrelic.com',
      description: 'Description about this doc reference',
    },
  ],
  icon: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_quickstarts/mock-quickstart-2/logo.png',
  keywords: ['list', 'of', 'searchable', 'keywords'],
  sourceUrl:
    'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_quickstarts/mock-quickstart-2',
  summary: 'A short form description for this quickstart',
  installPlanStepIds: ['infra-agent-targeted'],
  alertConditions: [
    {
      description:
        "This alert triggers when the reported health of an Elasticsearch cluster is 'red'.",
      displayName: 'Cluster Health',
      rawConfiguration:
        '{"name":"Cluster Health","details":"This alert triggers when the reported health of an Elasticsearch cluster is \'red\'.\\n","type":"STATIC","nrql":{"query":"FROM ElasticsearchClusterSample SELECT uniqueCount(displayName) WHERE cluster.status = \'red\' FACET displayName"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":0,"thresholdDuration":300,"thresholdOccurrences":"AT_LEAST_ONCE"}],"violationTimeLimitSeconds":86400}',
      type: 'STATIC',
    },
    {
      description:
        'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.',
      displayName: 'Errors',
      rawConfiguration:
        '{"name":"Errors","details":"This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.\\n","type":"STATIC","nrql":{"query":"from Transaction select percentage(count(*), where error is not false) as \'Errors\' where transactionType = \'Web\' facet appName"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":10,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"expiration":{"closeViolationsOnExpiration":true,"openViolationOnExpiration":false,"expirationDuration":86400},"violationTimeLimitSeconds":86400}',
      type: 'STATIC',
    },
  ],
};

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

  test.only('buildMutationVariables returns expected mutation input from quickstart config', () => {
    const mutationInput = buildMutationVariables(
      readQuickstartFile(
        `${process.cwd()}/mock_quickstarts/mock-quickstart-2/config.yml`
      )
    );
    expect(mutationInput).toEqual(expectedMockQuickstart2MutationInput);
  });
});
