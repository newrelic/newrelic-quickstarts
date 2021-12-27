'use strict';

const {
  validateInstallPlan,
  VALIDATE_INSTALL_PLAN_MUTATION,
} = require('../validate-install-plans');

const githubHelpers = require('../github-api-helpers');
const nrGraphqlHelpers = require('../nr-graphql-helpers');

jest.mock('@actions/core');
jest.spyOn(global.console, 'error').mockImplementation(() => {});

jest.mock('../github-api-helpers', () => ({
  ...jest.requireActual('../github-api-helpers'),
  filterInstallPlans: jest.fn(),
}));

jest.mock('../nr-graphql-helpers', () => ({
  ...jest.requireActual('../nr-graphql-helpers'),
  fetchNRGraphqlResults: jest.fn(),
}));

const validInstallFilename = 'mock-install-1/install.yml';
const invalidInstallFilename1 = 'mock-install-2/install.yml';
const invalidInstallFilename2 = 'mock-install-3/install.yml';

const NR_API_URL = process.env.NR_API_URL;

const mockGithubAPIFiles = (filenames) =>
  filenames.map((filename) => ({
    sha: '',
    filename: `utils/mock_files/${filename}`,
    status: 'added',
    additions: 0,
    deletions: 0,
    changes: 0,
    blob_url: '',
    raw_url: '',
    contents_url: '',
    patch: '',
  }));

const mockGraphqlRequestBody = (variables = {}) => ({
  queryString: VALIDATE_INSTALL_PLAN_MUTATION,
  variables: {
    id: 'infra-agent-targeted',
    displayName: 'Test Install Agent',
    heading: 'Test Install Install',
    description: 'this is some description\n',
    target: {
      type: 'AGENT',
      destination: 'HOST',
      os: ['LINUX', 'WINDOWS'],
    },
    primary: {
      mode: 'TARGETED',
      destination: 'test-install-installer',
    },
    fallback: {
      mode: 'LINK',
      destination:
        'https://docs.newrelic.com/docs/infrastructure/install-infrastructure-agent/linux-installation/install-infrastructure-monitoring-agent-linux/#manual-install',
    },
    ...variables,
  },
});

const mockGraphqlResponse = ({ data = {}, errors } = {}) => ({
  data,
  ...(errors && { errors }),
});

const buildMockNRError = (message, argumentPath) => ({
  message,
  path: ['nr1CatalogSubmitInstallPlanStep'],
  extensions: {
    nerdGraphExtensions: { errorClass: 'VALIDATION_ERROR' },
    argumentPath,
  },
});

describe('Action: validate install plan id', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('succeeds with valid install plan id', () => {
    const files = mockGithubAPIFiles([validInstallFilename]);
    const requestBody = mockGraphqlRequestBody();
    const response = mockGraphqlResponse();

    githubHelpers.filterInstallPlans.mockReturnValueOnce(files);
    nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue(response);

    validateInstallPlan(files);

    expect(global.console.error).not.toHaveBeenCalled();
    expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledWith(
      requestBody
    );
  });
});
