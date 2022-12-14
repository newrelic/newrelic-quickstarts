'use strict';

import Dashboard from '../lib/Dashboard';
import * as githubHelpers from '../lib/github-api-helpers';
import { setDashboardsRequiredDataSources } from '../set-dashboards-required-datasources';

jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.mock('../lib/github-api-helpers', () => ({
  ...jest.requireActual('../lib/github-api-helpers'),
  filterQuickstartConfigFiles: jest.fn(),
  fetchPaginatedGHResults: jest.fn(),
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

const validQuickstartFilename = 'quickstarts/mock-quickstart-2/config.yml';

describe('set-dashboards-required-datasources', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('succeeds on happy path', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);

    Dashboard.mockImplementation(() => {
      submitSetRequiredDataSources: () => Promise.resolve({});
    });

    const hasErrored = await setDashboardsRequiredDataSources('url', 'token');
    expect(hasErrored).toBe(false);
  });
});
