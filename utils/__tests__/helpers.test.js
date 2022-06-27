'use strict';
const helpers = require('../helpers');
const {
  mockGitHubResponseFilenames,
  addFilenameObject,
} = require('./test-utilities');

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getFileExtension, given a file of type .png, returns .png as the extension', () => {
    const input = 'test/file/ext.png';
    const output = helpers.getFileExtension(input);
    expect(output).toBe('.png');
  });

  test('getFileExtension, Given a directory path, returns an empty string as the extension', () => {
    const input = 'test/file/ext';
    const output = helpers.getFileExtension(input);
    expect(output).toBe('');
  });

  test('cleanQuickstartName, returns a string with - replacing whitespace and punctuation removed', () => {
    const input1 = 'Golden Signals Web';
    const input2 = 'Logrus';

    const output1 = helpers.cleanQuickstartName(input1);
    const output2 = helpers.cleanQuickstartName(input2);

    expect(output1).toBe('golden-signals-web');
    expect(output2).toBe('logrus');
  });

  test('getMatchingNames, returns an array of objects with a name field and a path field', () => {
    const input = [
      {
        name: 'apache',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/apache/dashboards/apache.json',
      },
      {
        name: 'data-ingestion-breakdown',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/audit/account-data-ingestion-analysis/dashboards/data_ingestion_breakdown.json',
      },
      {
        name: 'new-relic-audit',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/audit/audit-events-analysis/dashboards/audit.json',
      },
      {
        name: 'aws-integrations-data-ingest-analysis',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/audit/infrastructure-integrations-data-analysis/dashboards/aws-integrations-data-ingest-analysis.json',
      },
      {
        name: 'azure-integrations-data-ingest-analysis',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/audit/infrastructure-integrations-data-analysis/dashboards/azure-integrations-data-ingest-analysis.json',
      },
      {
        name: 'java',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/java/camel/dashboards/java.json',
      },
      {
        name: 'java',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/java/coldfusion/dashboards/java.json',
      },
      {
        name: 'java',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/java/cxf/dashboards/java.json',
      },
      {
        name: 'java',
        path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/java/derby/dashboards/java.json',
      },
    ];
    const output = helpers.getMatchingNames(input);
    expect(output).toContainEqual({
      name: 'java',
      path: '/Users/lbrammer/Work/dev-exp/newrelic-quickstarts/quickstarts/java/cxf/dashboards/java.json',
    });
    expect(output).toHaveLength(4);
  });

  describe('getQuickstartFromFilename', () => {
    test('getQuickstartFromFilename returns the quickstart an alert belongs to', () => {
      const quickstartFromAlert = helpers.getQuickstartFromFilename(
        'quickstarts/python/aiohttp/alerts/ApdexScore.yml'
      );

      expect(quickstartFromAlert).toEqual('python/aiohttp');
    });

    test('getQuickstartFromFilename returns the quickstart a dashboard belongs to', () => {
      const quickstartFromDashboard = helpers.getQuickstartFromFilename(
        'quickstarts/python/pysqlite/dashboards/python.json'
      );

      expect(quickstartFromDashboard).toEqual('python/pysqlite');
    });

    test('getQuickstartFromFilename returns the quickstart an icon belongs to', () => {
      const quickstartFromIcon = helpers.getQuickstartFromFilename(
        'quickstarts/python/pysqlite/logo.svg'
      );

      expect(quickstartFromIcon).toEqual('python/pysqlite');
    });

    test('getQuickstartFromFilename does not return non-quickstarts files', () => {
      const mockQuickstart = helpers.getQuickstartFromFilename(
        '.github/workflows/validate_packs.yml'
      );

      expect(mockQuickstart).toBeUndefined();
    });

    test('getQuickstartFromFilename does not return mock quickstarts', () => {
      const mockQuickstart = helpers.getQuickstartFromFilename(
        'utils/mock_files/mock-quickstart-1/config.yml'
      );

      expect(mockQuickstart).toBeUndefined();
    });

    test('buildUniqueQuickstartSet returns a list of unique quickstarts', () => {
      const expectedUniqueQuickstartDirectories = new Set([
        'foo/duplicate-directory-name',
        'bar/duplicate-directory-name',
        'python/aiohttp',
        'test-quickstart-folder',
        'test-quickstart-folder-2',
        'python/pysqlite',
      ]);

      const uniqueQuickstarts = mockGitHubResponseFilenames
        .map(addFilenameObject)
        .reduce(helpers.buildUniqueQuickstartSet, new Set());

      expect(uniqueQuickstarts).toEqual(expectedUniqueQuickstartDirectories);
    });
  });
});
