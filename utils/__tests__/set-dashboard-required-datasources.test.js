'use strict';

import Dashboard from '../lib/Dashboard';
import * as githubHelpers from '../lib/github-api-helpers';
import * as nrGraphQlHelpers from '../lib/nr-graphql-helpers';
import { setDashboardsRequiredDataSources } from '../set-dashboards-required-datasources';

jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.spyOn(global.console, 'log').mockImplementation(() => {});

jest.mock('../lib/github-api-helpers', () => ({
  ...jest.requireActual('../lib/github-api-helpers'),
  filterQuickstartConfigFiles: jest.fn(),
  fetchPaginatedGHResults: jest.fn(),
}));

jest.mock('../lib/nr-graphql-helpers', () => ({
  ...jest.requireActual('../lib/nr-graphql-helpers'),
  getPublishedComponentIds: jest.fn(),
}));

jest.mock('../lib/Dashboard');

const mockGithubAPIFiles = (filenames) =>
  filenames.map((filename) => ({
    sha: '',
    filename: `${filename}`,
    status: 'added',
    additions: 0,
    deletions: 0,
    changes: 0,
    blob_url: '',
    raw_url: '',
    contents_url: '',
    patch: '',
  }));

const validQuickstartFilename =
  'utils/mock_files/quickstarts/mock-quickstart-2/config.yml';

const quickstartWithMultipleDataSourcesFilename =
  'utils/mock_files/quickstarts/mock-quickstart-3/config.yml';

const mockSubmitSetRequiredDataSourcesResult = {
  data: {
    nr1CatalogSetRequiredDataSourcesForDashboardTemplate: {
      dashboardTemplate: {
        id: 1234,
      },
    },
  },
  errors: [],
};

describe('set-dashboards-required-datasources', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('succeeds on happy path', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphQlHelpers.getPublishedComponentIds.mockReturnValueOnce({
      componentIdsMap: {
        dataSourceIds: ['test-data-source'],
        dashboardIds: ['mock-dashboard-1'],
      },
    });

    Dashboard.submitSetRequiredDataSourcesMutation = jest
      .fn()
      .mockResolvedValue(mockSubmitSetRequiredDataSourcesResult);

    const hasErrored = await setDashboardsRequiredDataSources('url', 'token');
    expect(hasErrored).toBe(false);
  });

  test('fails if there is an error', async () => {
    const mockError = new Error('Something went wrong');
    const mockResultWithError = Object.assign(
      {},
      mockSubmitSetRequiredDataSourcesResult,
      { errors: [mockError] }
    );

    const mockDataSourceId = 'test-data-source';
    const mockDashboardId = 'mock-dashboard-1';

    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphQlHelpers.getPublishedComponentIds.mockReturnValueOnce({
      componentIdsMap: {
        dataSourceIds: [mockDataSourceId],
        dashboardIds: [mockDashboardId],
      },
    });

    Dashboard.submitSetRequiredDataSourcesMutation = jest
      .fn()
      .mockResolvedValue(mockResultWithError);

    const hasErrored = await setDashboardsRequiredDataSources('url', 'token');
    expect(hasErrored).toBe(true);
    expect(console.error).toHaveBeenCalledWith(
      `Failed to associate dashboard with id ${mockDashboardId} to ${JSON.stringify(
        [mockDataSourceId]
      )}`
    );

    expect(console.error).toHaveBeenCalledWith(`- ${mockError.message}`);
  });

  test('succeeds but skips quickstart if there are multiple datasources', async () => {
    const files = mockGithubAPIFiles([
      quickstartWithMultipleDataSourcesFilename,
    ]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);

    jest.spyOn(Dashboard, 'submitSetRequiredDataSourcesMutation');

    const hasErrored = await setDashboardsRequiredDataSources('url', 'token');
    expect(hasErrored).toBe(false);
    expect(console.error).toHaveBeenCalledWith(
      `Multiple Quickstart data sources detected for Quickstart: Template Quickstart, Dashboards must be updated manually`
    );

    expect(Dashboard.submitSetRequiredDataSourcesMutation).not.toBeCalled();
  });
});
