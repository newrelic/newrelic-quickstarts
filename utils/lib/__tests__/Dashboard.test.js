import Dashboard from '../Dashboard';
import * as path from 'path';
import * as fs from 'fs';
import * as nrGraphqlHelpers from '../nr-graphql-helpers';

import {
  GITHUB_REPO_BASE_URL,
  DASHBOARD_REQUIRED_DATA_SOURCES_QUERY,
  DASHBOARD_SET_REQUIRED_DATA_SOURCES_MUTATION,
} from '../../constants';

// TODO: maybe there is an easier way to mock a single function on this library
jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    readFileSync: jest.fn().mockImplementation(originalModule.readFileSync),
  };
});

jest.mock('../nr-graphql-helpers', () => {
  const originalModule = jest.requireActual('../nr-graphql-helpers');
  return {
    __esModule: true,
    ...originalModule,
    fetchNRGraphqlResults: jest.fn(),
  };
});

jest.spyOn(global.console, 'log').mockImplementation(() => {});

const MOCK_FILES_BASEPATH = path.resolve(__dirname, '../../mock_files');

describe('Dashboard', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('Creates valid Dashboard', () => {
      const dash = new Dashboard('mock-dashboard-2', MOCK_FILES_BASEPATH);
      expect(dash.isValid).toBe(true);
      expect(dash.config).toBeDefined();
    });

    test('Creates invalid Dashboard when file does not exist', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const dash = new Dashboard(
        'mock-dashboard-infinity',
        MOCK_FILES_BASEPATH
      );
      expect(dash.isValid).toBe(false);
      expect(dash.config).not.toBeDefined();
      expect(console.error).toBeCalled();
    });
  });

  describe('getConfigFilePath', () => {
    test('Creates valid configPath', () => {
      const dash = new Dashboard('mock-dashboard-2', MOCK_FILES_BASEPATH);
      expect(dash.configPath).toEqual('dashboards/mock-dashboard-2/dash.json');
      expect(dash.isValid).toBe(true);
    });

    test('Fails to create valid config path when dashboard does not exist', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const dash = new Dashboard(
        'mock-dashboard-infinite',
        MOCK_FILES_BASEPATH
      );
      expect(dash.configPath).toEqual('');
      expect(dash.isValid).toBe(false);
      expect(console.error).toBeCalled();
    });

    test('Fails to create valid config path, basePath is invalid', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});
      const dash = new Dashboard('mock-dashboard-2', __dirname);
      expect(dash.configPath).toEqual('');
      expect(dash.isValid).toBe(false);
      expect(console.error).toBeCalled();
    });
  });

  describe('getConfigContent', () => {
    test('returns undefined if dashboard is invalid', () => {
      const dash = new Dashboard('', MOCK_FILES_BASEPATH);
      dash.isValid = false;
      expect(dash.getConfigContent()).not.toBeDefined();
    });

    test('returns undefined if dashboard cannot be found on the filesystem', () => {
      const dash = new Dashboard('', MOCK_FILES_BASEPATH);
      expect(dash.getConfigContent()).not.toBeDefined();
    });

    test('returns undefined if there is an error when reading from the filesystem', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('test');
      });
      const dash = new Dashboard('mock-dashboard-2', MOCK_FILES_BASEPATH);
      expect(dash.isValid).toBe(false);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    test('returns config for dashboard', () => {
      const dash = new Dashboard('mock-dashboard-2', MOCK_FILES_BASEPATH);
      const config = dash.getConfigContent();
      expect(config).toBeDefined();
      expect(config.name).toBeDefined();
      expect(config.pages).toBeDefined();
    });
  });

  describe('getMutationVariables', () => {
    test('returned string values are trimmed for whitespace', () => {
      const dash = new Dashboard('mock-dashboard-1', MOCK_FILES_BASEPATH);
      dash.config.name = 'Blah      ';
      dash.config.description = '     test test';
      const mutationVar = dash.getMutationVariables();
      expect(mutationVar.displayName).toEqual('Blah');
      expect(mutationVar.description).toEqual('test test');
    });

    test('returned values match dashboard configuration', () => {
      const dash = new Dashboard('mock-dashboard-1', MOCK_FILES_BASEPATH);
      const mutationVar = dash.getMutationVariables();

      expect(mutationVar.displayName).toEqual('.NET');
      expect(mutationVar.description).toEqual('.NET');
      expect(mutationVar.sourceUrl).toEqual(
        `${GITHUB_REPO_BASE_URL}/dashboards/mock-dashboard-1/dash.json`
      );
    });

    test('returns screenshot urls', () => {
      const dash = new Dashboard('mock-dashboard-2', MOCK_FILES_BASEPATH);
      const mutationVar = dash.getMutationVariables();

      expect(mutationVar.screenshots).toHaveLength(3);
    });

    test('returns empty array when no screenshots are present', () => {
      const dash = new Dashboard('mock-dashboard-1', MOCK_FILES_BASEPATH);
      const mutationVar = dash.getMutationVariables();

      expect(mutationVar.screenshots).toHaveLength(0);
    });
  });

  describe('submitSetRequiredDataSourcesMutation', () => {
    test('returns result with data and no errors when successful', async () => {
      const mockTemplateId = 'mock-template-id';
      const mockExistingDataSourceIds = [
        'mock-data-source-1',
        'mock-data-source-2',
      ];
      const mockNewDataSourceIds = ['mock-data-source-1', 'mock-data-source-3'];

      const dashboardQueryResponse = {
        data: {
          actor: {
            nr1Catalog: {
              dashboardTemplate: {
                metadata: {
                  requiredDataSources: mockExistingDataSourceIds,
                },
              },
            },
          },
        },
      };

      const mockMutationResponse = {
        data: {
          nr1CatalogSetRequiredDataSourcesForDashboardTemplate: {
            dashboardTemplate: {
              id: mockTemplateId,
            },
          },
        },
      };

      nrGraphqlHelpers.fetchNRGraphqlResults.mockImplementation(
        ({ queryString }) => {
          if (queryString === DASHBOARD_REQUIRED_DATA_SOURCES_QUERY) {
            return Promise.resolve(dashboardQueryResponse);
          }

          if (queryString === DASHBOARD_SET_REQUIRED_DATA_SOURCES_MUTATION) {
            return Promise.resolve(mockMutationResponse);
          }

          throw new Error(
            `Could not mock response for queryString: ${queryString}`
          );
        }
      );

      const result = await Dashboard.submitSetRequiredDataSourcesMutation(
        mockTemplateId,
        mockNewDataSourceIds
      );

      expect(result).toBe(mockMutationResponse);
    });
  });
});
