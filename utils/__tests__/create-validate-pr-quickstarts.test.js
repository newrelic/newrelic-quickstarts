'use strict';

import { createValidateQuickstarts } from '../create_validate_pr_quickstarts';

import Quickstart from '../lib/Quickstart';
import InstallPlan from '../lib/InstallPlan';
import * as githubHelpers from '../lib/github-api-helpers';
import * as nrGraphqlHelpers from '../lib/nr-graphql-helpers';

jest.mock('@actions/core');
jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.mock('../lib/github-api-helpers', () => ({
  ...jest.requireActual('../lib/github-api-helpers'),
  filterQuickstartConfigFiles: jest.fn(),
  fetchPaginatedGHResults: jest.fn(),
}));

jest.mock('../lib/nr-graphql-helpers', () => ({
  ...jest.requireActual('../lib/nr-graphql-helpers'),
  getPublishedDataSourceIds: jest.fn(),
}))

jest.mock('../lib/Quickstart');
jest.mock('../lib/InstallPlan');

const validQuickstartFilename = 'quickstarts/mock-quickstart-2/config.yml';
const validQuickstartFilenameWithCoreDataSource =
  'quickstarts/mock-quickstart-9/config.yml';

const mockNGQuickstartErr = (data) => ({
  data,
  errors: [
    {
      extensions: {
        argumentPath: [`slug`],
      },
      message: `slug must be lowercase`,
    },
  ],
});

const mockNGInstallPlanErr = (data) => ({
  data,
  errors: [
    {
      extensions: {
        argumentPath: [`installPlanStepIds`],
      },
      message: `contains an install plan step that does not exist`,
    },
  ],
});

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

describe('create-validate-pr-quickstarts', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('succeeds on happy path', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: [],
      errors: [] 
    });

    Quickstart.mockImplementation(() => {
      return {
        config: {
          installPlans: ['valid-id'],
        },
        isValid: true,
        validate: jest.fn().mockImplementation(() => true),
        submitMutation: jest.fn().mockResolvedValueOnce({
          data: {},
          errors: [],
        }),
      };
    });
    InstallPlan.mockImplementationOnce(() => {
      return { isValid: true };
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(false);
  });

  test('fails for nerdgraph validation error', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: [],
      errors: [] 
    });
    

    Quickstart.mockImplementation(() => {
      return {
        config: {
          installPlans: ['valid-id'],
        },
        isValid: true,
        validate: jest.fn().mockImplementation(() => true),
        submitMutation: jest
          .fn()
          .mockResolvedValueOnce(mockNGQuickstartErr({})),
      };
    });
    InstallPlan.mockImplementationOnce(() => {
      return { isValid: true };
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(true);
  });

  test('does not fail for install plan id error', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: [],
      errors: [] 
    });

    Quickstart.mockImplementation(() => {
      return {
        config: {
          installPlans: ['valid-id'],
        },
        isValid: true,
        validate: jest.fn().mockImplementation(() => true),
        submitMutation: jest
          .fn()
          .mockResolvedValueOnce(mockNGInstallPlanErr({})),
      };
    });
    InstallPlan.mockImplementationOnce(() => {
      return { isValid: true };
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(false);
  });

  test('does not process removed file', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilename]);
    files[0].status = 'removed';
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: [],
      errors: [] 
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(false);
  });

  test(`fails workflow if core data source doesn't exist`, async () => {
    const files = mockGithubAPIFiles([validQuickstartFilenameWithCoreDataSource]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: [],
      errors: [] 
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(true);
  })

  test('validates quickstart if core data source exists', async () => {
    const files = mockGithubAPIFiles([validQuickstartFilenameWithCoreDataSource]);
    githubHelpers.fetchPaginatedGHResults.mockResolvedValueOnce(files);
    githubHelpers.filterQuickstartConfigFiles.mockReturnValueOnce(files);
    nrGraphqlHelpers.getPublishedDataSourceIds.mockResolvedValueOnce({
      coreDataSourceIds: ['nodejs'],
      errors: [] 
    });

    Quickstart.mockImplementation(() => {
      return {
        config: {
          dataSourceIds: ['nodejs'],
        },
        isValid: true,
        validate: jest.fn().mockImplementation(() => true),
        submitMutation: jest.fn().mockResolvedValueOnce({
          data: {},
          errors: [],
        }),
      };
    });

    const hasErrored = await createValidateQuickstarts('url', 'token');
    expect(hasErrored).toBe(false);

  })
});
