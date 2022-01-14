'use strict';

const path = require('path');
const { expect } = require('@jest/globals');

const {
  getQuickstartFromFilename,
  getQuickstartConfigPaths,
  buildMutationVariables,
  buildUniqueQuickstartSet,
  getGraphqlRequests,
} = require('../validate_pr_quickstarts');
const { readQuickstartFile } = require('../helpers');

const mockDashboardRawConfigurationJSON = require('../mock_files/mock_dashboard_config.json');
const mockDashboardRawConfiguration = JSON.stringify(
  mockDashboardRawConfigurationJSON
);

const buildFullQuickstartFilePaths = (relativePaths) => {
  return relativePaths.map((relativePath) => {
    return path.resolve(process.cwd(), `..${relativePath}`);
  });
};

const mockGitHubResponseFilenames = [
  'quickstarts/test-quickstart-folder/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder/config.yml',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder/icon.jpeg',
  'quickstarts/test-quickstart-folder/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
  'quickstarts/test-quickstart-folder-2/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder-2/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder-2/config.yml',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder-2/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
  'quickstarts/python/aiohttp/alerts/ApdexScore.yml',
  'quickstarts/python/pysqlite/dashboards/python.json',
  'quickstarts/python/pysqlite/logo.svg',
  '.github/workflows/validate_packs.yml',
  'utils/__tests__/validate_install_plans.test.js',
  'utils/github-api-helpers.js',
  'utils/helpers.js',
  'utils/package.json',
  'utils/validate-install-plan.js',
  'utils/yarn.lock',
];

const addFilenameObject = (filename) => ({ filename });

const expectedUniqueQuickstartDirectories = new Set([
  'aiohttp',
  'test-quickstart-folder',
  'test-quickstart-folder-2',
  'pysqlite',
]);

const quickstartNames = new Set([
  'aws-ec2',
  'infrastructure',
  'aiohttp',
  'pysqlite',
  'postgresql',
]);

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
  id: 'mock-2-id',
  quickstartMetadata: {
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
    icon: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_files/mock-quickstart-2/logo.png',
    keywords: ['list', 'of', 'searchable', 'keywords'],
    sourceUrl:
      'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-2',
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
        sourceUrl: 'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-2/alerts/Cluster Health.yml',
      },
      {
        description:
          'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.',
        displayName: 'Errors',
        rawConfiguration:
          '{"name":"Errors","details":"This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.\\n","type":"STATIC","nrql":{"query":"from Transaction select percentage(count(*), where error is not false) as \'Errors\' where transactionType = \'Web\' facet appName"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":10,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"expiration":{"closeViolationsOnExpiration":true,"openViolationOnExpiration":false,"expirationDuration":86400},"violationTimeLimitSeconds":86400}',
        type: 'STATIC',
        sourceUrl: 'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-2/alerts/errors.yml',
      },
    ],
    dashboards: [
      {
        description: '.NET',
        displayName: '.NET',
        rawConfiguration: mockDashboardRawConfiguration,
        sourceUrl: 'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-2/dashboards/dotnet.json',
        screenshots: [
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_files/mock-quickstart-2/dashboards/dotnet.png',
          },
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_files/mock-quickstart-2/dashboards/dotnet02.png',
          },
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_files/mock-quickstart-2/dashboards/dotnet03.png',
          },
        ],
      },
    ],
  },
};

const expectedMockQuickstart4MutationInput = {
  id: undefined,
  quickstartMetadata: {
    sourceUrl:
      'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-4',
    alertConditions: undefined,
    authors: undefined,
    categoryTerms: undefined,
    dashboards: undefined,
    description: undefined,
    displayName: undefined,
    documentation: undefined,
    icon: undefined,
    installPlanStepIds: undefined,
    keywords: undefined,
    sourceUrl:
      'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_files/mock-quickstart-4',
    summary: undefined,
  },
};

test('getQuickstartFromFilename returns the quickstart an alert belongs to', () => {
  const quickstartFromAlert = getQuickstartFromFilename(
    'quickstarts/python/aiohttp/alerts/ApdexScore.yml'
  );

  expect(quickstartFromAlert).toEqual('aiohttp');
});

test('getQuickstartFromFilename returns the quickstart a dashboard belongs to', () => {
  const quickstartFromDashboard = getQuickstartFromFilename(
    'quickstarts/python/pysqlite/dashboards/python.json'
  );

  expect(quickstartFromDashboard).toEqual('pysqlite');
});

test('getQuickstartFromFilename returns the quickstart a logo belongs to', () => {
  const quickstartFromLogo = getQuickstartFromFilename(
    'quickstarts/python/pysqlite/logo.svg'
  );

  expect(quickstartFromLogo).toEqual('pysqlite');
});

test('getQuickstartFromFilename does not return non-quickstarts files', () => {
  const mockQuickstart = getQuickstartFromFilename(
    '.github/workflows/validate_packs.yml'
  );

  expect(mockQuickstart).toBeUndefined();
});

test('getQuickstartFromFilename does not return mock quickstarts', () => {
  const mockQuickstart = getQuickstartFromFilename(
    'utils/mock_files/mock-quickstart-1/config.yml'
  );

  expect(mockQuickstart).toBeUndefined();
});

test('buildUniqueQuickstartSet returns a list of unique quickstarts', () => {
  const uniqueQuickstarts = mockGitHubResponseFilenames
    .map(addFilenameObject)
    .reduce(buildUniqueQuickstartSet, new Set());

  expect(uniqueQuickstarts).toEqual(expectedUniqueQuickstartDirectories);
});

test('getQuickstartConfigPaths returns list of unique quickstart config filepaths', () => {
  const configPaths = getQuickstartConfigPaths(quickstartNames);

  expect(configPaths).toEqual(expectedQuickstartConfigFullPaths);
});

test('buildMutationVariables returns expected mutation input from quickstart config', () => {
  const mutationInput = buildMutationVariables(
    readQuickstartFile(
      `${process.cwd()}/mock_files/mock-quickstart-2/config.yml`
    )
  );

  expect(mutationInput).toEqual(expectedMockQuickstart2MutationInput);
});

test('buildMutationVariables handles an empty config file', () => {
  const mutationInput = buildMutationVariables(
    readQuickstartFile(
      `${process.cwd()}/mock_files/mock-quickstart-4/config.yml`
    )
  );

  expect(mutationInput).toEqual(expectedMockQuickstart4MutationInput);
});

test('getGraphqlRequests constructs requests with a filepath and variables structure', () => {
  const graphqlRequests = getGraphqlRequests(
    mockGitHubResponseFilenames.map(addFilenameObject)
  );

  expect(graphqlRequests.length).toEqual(2);
  expect(
    graphqlRequests.every(({ filePath }) => filePath.includes('quickstarts/'))
  ).toBeTruthy();
  expect(graphqlRequests[0].variables.id).toEqual(
    'e7948525-8726-46a5-83fa-04732ad42fd1'
  );
  expect(graphqlRequests[0].filePath).toEqual(
    'quickstarts/python/aiohttp/config.yml'
  );
});
