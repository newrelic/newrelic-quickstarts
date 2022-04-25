'use strict';

const {
  readDataSourceFile,
  readDataSourceFiles,
  parseInstallDirective,
  getIconUrl,
  parseDataSource,
  createValidateUpdateDataSources,
  recordCustomNREvent,
} = require('../create-validate-data-sources');

const githubHelpers = require('../github-api-helpers');
const nrGraphqlHelpers = require('../nr-graphql-helpers');
const helpers = require('../helpers');
const newrelicEvent = require('../newrelic/customEvent');

jest.mock('@actions/core');
jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.mock('../github-api-helpers', () => ({
  ...jest.requireActual('../github-api-helpers'),
  filterInstallPlans: jest.fn(),
}));

jest.mock('../nr-graphql-helpers', () => ({
  ...jest.requireActual('../nr-graphql-helpers'),
  fetchNRGraphqlResults: jest.fn(),
  translateMutationErrors: jest.fn(),
}));

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  passedProcessArguments: jest.fn(),
}));

jest.mock('../newrelic/customEvent', () => ({
  ...jest.requireActual('../newrelic/customEvent'),
  track: jest.fn(),
}));

const mockDataSource = 'utils/mock_files/mock-data-source-1/config.yml';

describe('create-validate-data-sources', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('readDataSourceFile', () => {
    test('reads file from disc', () => {
      const ds = readDataSourceFile(mockDataSource);
      expect(ds.filePath).toContain(mockDataSource);
      expect(ds.contents.id).toEqual('test-data-source');
    });
    test('handles file not existing on disc', () => {
      expect(() => readDataSourceFile('fake-config-path.yml')).toThrow();
    });
  });

  describe('readDataSourceFiles', () => {
    test('reads multiple files from disc', () => {
      const ds = readDataSourceFiles([mockDataSource, mockDataSource]);
      expect(ds).toHaveLength(2);
      expect(ds[0].filePath).toContain(mockDataSource);
      expect(ds[0].contents.id).toEqual('test-data-source');
    });
  });

  describe('parseInstall', () => {
    test('outputs same object, when input does not match a directive', () => {
      const installDirective = {
        cool: {
          fake: 'object',
        },
      };

      const directiveInput = parseInstallDirective(installDirective);
      expect(directiveInput).toEqual(installDirective);
    });

    describe('link directive', () => {
      test('outputs directive correctly', () => {
        const installDirective = {
          link: {
            url: 'https://newrelic.com',
          },
        };

        const directiveInput = parseInstallDirective(installDirective);
        expect(directiveInput).toHaveProperty('link');
        expect(directiveInput.link).toHaveProperty('url');
        expect(directiveInput.link.url).toEqual('https://newrelic.com');
      });
      test('outputs without url', () => {
        const installDirective = {
          link: {},
        };

        const directiveInput = parseInstallDirective(installDirective);
        expect(directiveInput).toHaveProperty('link');
        expect(directiveInput.link).toHaveProperty('url');
        expect(directiveInput.link.url).toEqual('');
      });
    });

    describe('nerdlet directive', () => {
      test('outputs directive correctly', () => {
        const installDirective = {
          nerdlet: {
            nerdletId: 'test',
            nerdletState: {
              testParam: 'param test',
            },
            requiresAccount: true,
          },
        };

        const directiveInput = parseInstallDirective(installDirective);
        expect(directiveInput).toHaveProperty('nerdlet');
        expect(directiveInput.nerdlet).toHaveProperty('nerdletId');
        expect(directiveInput.nerdlet).toHaveProperty('nerdletState');
        expect(directiveInput.nerdlet).toHaveProperty('requiresAccount');

        expect(directiveInput.nerdlet.nerdletState).toEqual(
          JSON.stringify(installDirective.nerdlet.nerdletState)
        );
        expect(directiveInput.nerdlet.requiresAccount).toBe(true);
      });

      test('outputs directive without nerdletState', () => {
        const installDirective = {
          nerdlet: {
            nerdletId: 'test',
            requiresAccount: true,
          },
        };

        const directiveInput = parseInstallDirective(installDirective);
        expect(directiveInput).toHaveProperty('nerdlet');
        expect(directiveInput.nerdlet).toHaveProperty('nerdletId');
        expect(directiveInput.nerdlet).toHaveProperty('nerdletState');
        expect(directiveInput.nerdlet).toHaveProperty('requiresAccount');
        expect(directiveInput.nerdlet.nerdletState).toBeUndefined();
      });
    });
  });

  describe('getIconUrl', () => {
    test('returns correct icon url', () => {
      const iconName = 'logo.png';
      const configPath =
        '/newrelic-quickstarts/path/to/data-sources/fake-data-source/config.yml';

      const actualIconUrl = getIconUrl(iconName, configPath);

      expect(actualIconUrl).toBe(
        `https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/path/to/data-sources/fake-data-source/${iconName}`
      );
    });
  });

  describe('parseDataSource', () => {
    test.each([
      {
        testCaseName: 'returns correct data source with trimmed values',
        expectedResult: {
          id: 'fake_id',
          dryRun: true,
          dataSourceMetadata: {
            displayName: 'fake_display_name',
            icon:
              'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/path/to/data-sources/fake-data-source/fake_logo.png',
            install: {
              primary: {
                link: {
                  url: 'fake_url_1',
                },
              },
              fallback: {
                link: {
                  url: 'fake_url_2',
                },
              },
            },
            categoryTerms: ['fake_category_term_1'],
            keywords: ['fake_keyword_1'],
            description: 'fake_description',
          },
        },
        testInput: {
          dataSourceWithFilePath: {
            filePath:
              '/newrelic-quickstarts/path/to/data-sources/fake-data-source/config.yml',
            contents: {
              id: 'fake_id  ',
              displayName: 'fake_display_name  ',
              description: 'fake_description  ',
              install: {
                primary: {
                  link: {
                    url: 'fake_url_1  ',
                  },
                },
                fallback: {
                  link: {
                    url: 'fake_url_2  ',
                  },
                },
              },
              keywords: ['fake_keyword_1  '],
              categoryTerms: ['fake_category_term_1  '],
              icon: 'fake_logo.png',
            },
          },
          dryRun: true,
        },
      },
      {
        testCaseName:
          'returns correct data source with no keywords & categoryTerms',
        expectedResult: {
          id: 'fake_id',
          dryRun: true,
          dataSourceMetadata: {
            displayName: 'fake_display_name',
            icon:
              'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/path/to/data-sources/fake-data-source/fake_logo.png',
            install: {
              primary: {
                link: {
                  url: 'fake_url_1',
                },
              },
              fallback: {
                link: {
                  url: 'fake_url_2',
                },
              },
            },
            categoryTerms: undefined,
            keywords: undefined,
            description: 'fake_description',
          },
        },
        testInput: {
          dataSourceWithFilePath: {
            filePath:
              '/newrelic-quickstarts/path/to/data-sources/fake-data-source/config.yml',
            contents: {
              id: 'fake_id',
              displayName: 'fake_display_name',
              description: 'fake_description',
              install: {
                primary: {
                  link: {
                    url: 'fake_url_1',
                  },
                },
                fallback: {
                  link: {
                    url: 'fake_url_2',
                  },
                },
              },
              icon: 'fake_logo.png',
            },
          },
          dryRun: true,
        },
      },
      {
        testCaseName: 'returns correct data source with nerdlet install',
        expectedResult: {
          id: 'fake_id',
          dryRun: true,
          dataSourceMetadata: {
            displayName: 'fake_display_name',
            icon:
              'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/path/to/data-sources/fake-data-source/fake_logo.png',
            install: {
              primary: {
                nerdlet: {
                  nerdletId: 'fake_id',
                  nerdletState: JSON.stringify({
                    quickstart_id: 'fake_quickstart_id',
                  }),
                  requiresAccount: true,
                },
              },
              fallback: {
                link: {
                  url: 'fake_url_2',
                },
              },
            },
            categoryTerms: [],
            keywords: [],
            description: 'fake_description',
          },
        },
        testInput: {
          dataSourceWithFilePath: {
            filePath:
              '/newrelic-quickstarts/path/to/data-sources/fake-data-source/config.yml',
            contents: {
              id: 'fake_id',
              displayName: 'fake_display_name',
              description: 'fake_description',
              install: {
                primary: {
                  nerdlet: {
                    nerdletId: 'fake_id  ',
                    nerdletState: {
                      quickstart_id: 'fake_quickstart_id',
                    },
                    requiresAccount: true,
                  },
                },
                fallback: {
                  link: {
                    url: 'fake_url_2',
                  },
                },
              },
              keywords: [],
              categoryTerms: [],
              icon: 'fake_logo.png',
            },
          },
          dryRun: true,
        },
      },
    ])(
      '$testCaseName',
      ({ expectedResult, testInput: { dryRun, dataSourceWithFilePath } }) => {
        const actualDataSource = parseDataSource(
          dataSourceWithFilePath,
          dryRun
        );
        expect(actualDataSource).toEqual(expectedResult);
      }
    );
  });

  describe('createValidateUpdateDataSources', () => {
    test('sends a request for each data source', async () => {
      nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue({
        data: 'fake_data',
        errors: [{ fake_field: 'fake_error_1' }],
      });

      const dataSourceFiles = [
        { variables: 'fake_variable_1', filePath: 'fake_filepath_1' },
        { variables: 'fake_variable_2', filePath: 'fake_filepath_2' },
        { variables: 'fake_variable_3', filePath: 'fake_filepath_3' },
        { variables: 'fake_variable_4', filePath: 'fake_filepath_4' },
        { variables: 'fake_variable_5', filePath: 'fake_filepath_5' },
        { variables: 'fake_variable_6', filePath: 'fake_filepath_6' },
      ];

      await createValidateUpdateDataSources(dataSourceFiles);

      expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledTimes(
        dataSourceFiles.length
      );
    });

    test('reports success when all requests succeed', async () => {
      nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue({
        data: 'fake_data',
        errors: [],
      });

      const dataSourceFiles = [
        { variables: 'fake_variable_1', filePath: 'fake_filepath_1' },
        { variables: 'fake_variable_2', filePath: 'fake_filepath_2' },
        { variables: 'fake_variable_3', filePath: 'fake_filepath_3' },
      ];

      const hasFailed = await createValidateUpdateDataSources(dataSourceFiles);

      expect(hasFailed).toBe(false);
    });

    test('reports failure when at least one request fails', async () => {
      nrGraphqlHelpers.fetchNRGraphqlResults
        .mockReturnValueOnce({
          data: 'fake_data',
          errors: [],
        })
        .mockReturnValueOnce({
          data: 'fake_data',
          errors: [],
        })
        .mockReturnValue({
          data: 'fake_data',
          errors: [{ fake_field: 'fake_error_1' }],
        });

      const dataSourceFiles = [
        { variables: 'fake_variable_1', filePath: 'fake_filepath_1' },
        { variables: 'fake_variable_2', filePath: 'fake_filepath_2' },
        { variables: 'fake_variable_3', filePath: 'fake_filepath_3' },
      ];

      const hasFailed = await createValidateUpdateDataSources(dataSourceFiles);

      expect(nrGraphqlHelpers.translateMutationErrors).toHaveBeenCalledTimes(1);
      expect(hasFailed).toBe(true);
    });
  });

  describe('recordCustomNREvent', () => {
    test.each([
      {
        testCaseName: 'sends UPDATE_DATA_SOURCE FAILURE event',
        expectedResult: {
          event: newrelicEvent.CUSTOM_EVENT.UPDATE_DATA_SOURCES,
          status: 'failed',
        },
        testInput: {
          hasFailed: true,
          isDryRun: false,
        },
      },
      {
        testCaseName: 'sends UPDATE_DATA_SOURCE SUCCESS event',
        expectedResult: {
          event: newrelicEvent.CUSTOM_EVENT.UPDATE_DATA_SOURCES,
          status: 'success',
        },
        testInput: {
          hasFailed: false,
          isDryRun: false,
        },
      },
      {
        testCaseName: 'sends VALIDATE_DATA_SOURCE failure event',
        expectedResult: {
          event: newrelicEvent.CUSTOM_EVENT.VALIDATE_DATA_SOURCES,
          status: 'failed',
        },
        testInput: {
          hasFailed: true,
          isDryRun: true,
        },
      },
      {
        testCaseName: 'sends VALIDATE_DATA_SOURCE SUCCESS event',
        expectedResult: {
          event: newrelicEvent.CUSTOM_EVENT.VALIDATE_DATA_SOURCES,
          status: 'success',
        },
        testInput: {
          hasFailed: false,
          isDryRun: true,
        },
      },
    ])(
      '$testCaseName',
      async ({
        expectedResult: { event, status },
        testInput: { hasFailed, isDryRun },
      }) => {
        await recordCustomNREvent(hasFailed, isDryRun);

        expect(newrelicEvent.track).toHaveBeenCalledWith(event, { status });
      }
    );
  });
});
