'use strict';

const {
  createValidateUpdateInstallPlan,
  INSTALL_PLAN_MUTATION,
} = require('../create-validate-install-plans');

const githubHelpers = require('../github-api-helpers');
const nrGraphqlHelpers = require('../nr-graphql-helpers');
const helpers = require('../helpers');

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

jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  passedProcessArguments: jest.fn(),
}));

const validInstallFilename = 'mock-install-1/install.yml';
const invalidInstallFilename1 = 'mock-install-2/install.yml';
const invalidInstallFilename2 = 'mock-install-3/install.yml';
const invalidInstallFilename3 = 'mock-install-4/install.yml';

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
  queryString: INSTALL_PLAN_MUTATION,
  variables: {
    id: 'infra-agent-targeted',
    displayName: 'Test Install Agent',
    heading: 'Test Install Install',
    dryRun: true,
    description: 'this is some description\n',
    target: {
      type: 'AGENT',
      destination: 'HOST',
      os: ['LINUX', 'WINDOWS'],
    },
    primary: {
      targeted: {
        recipeName: 'test-install-installer',
      },
    },
    fallback: {
      link: {
        url: 'https://docs.newrelic.com/docs/infrastructure/install-infrastructure-agent/linux-installation/install-infrastructure-monitoring-agent-linux/#manual-install',
      },
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

  test('succeeds with valid install plan', async () => {
    const files = mockGithubAPIFiles([validInstallFilename]);
    const requestBody = mockGraphqlRequestBody();
    const response = mockGraphqlResponse();
    const processArgs = ['url', 'true'];

    githubHelpers.filterInstallPlans.mockReturnValueOnce(files);
    nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue(response);

    helpers.passedProcessArguments.mockReturnValue(processArgs);

    const hasFailed = await createValidateUpdateInstallPlan(files);

    expect(hasFailed).toBe(false);

    expect(global.console.error).not.toHaveBeenCalled();
    expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledWith(
      requestBody
    );
  });

  test('errors with invalid install plan', async () => {
    const files = mockGithubAPIFiles([invalidInstallFilename1]);
    const processArgs = ['url', 'true'];
    const requestBody = mockGraphqlRequestBody({
      fallback: { link: { url: 'invalid-url' } },
    });
    const response = mockGraphqlResponse({
      errors: [
        buildMockNRError('`url` is not a valid URL', [
          'installPlanStep',
          'fallback',
          'url',
        ]),
      ],
    });

    githubHelpers.filterInstallPlans.mockReturnValueOnce(files);
    nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue(response);
    helpers.passedProcessArguments.mockReturnValue(processArgs);

    const hasFailed = await createValidateUpdateInstallPlan(files);

    expect(hasFailed).toBe(true);

    expect(global.console.error).toHaveBeenCalled();
    expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledWith(
      requestBody
    );
  });

  test('errors with undefined name in install plan', async () => {
    const files = mockGithubAPIFiles([invalidInstallFilename2]);
    const processArgs = ['url', 'true'];
    const requestBody = mockGraphqlRequestBody({
      displayName: undefined,
    });

    const error = {
      message2:
        'Argument "installPlanStep" has invalid value {description: $description, displayName: $displayName, fallback: $fallback, heading: $heading, id: $id, primary: $primary, target: $target}.\nIn field "displayName": Expected type "String!", found $displayName.',
      message3: 'Variable "displayName": Expected non-null, found null.',
    };

    const response = mockGraphqlResponse({
      errors: [
        {
          message: error.message2,
        },
        {
          message: error.message3,
        },
      ],
    });

    githubHelpers.filterInstallPlans.mockReturnValueOnce(files);
    nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue(response);
    helpers.passedProcessArguments.mockReturnValue(processArgs);

    const hasFailed = await createValidateUpdateInstallPlan(files);

    expect(hasFailed).toBe(true);

    // the first error message should be the ERROR: with the filepath
    expect(global.console.error).toHaveBeenNthCalledWith(
      2,
      `- ${error.message2}`
    );
    expect(global.console.error).toHaveBeenNthCalledWith(
      3,
      `- ${error.message3}`
    );
    expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledWith(
      requestBody
    );
  });

  test('errors and calls NR even with no fields defined', async () => {
    const files = mockGithubAPIFiles([invalidInstallFilename3]);
    const processArgs = ['url', 'true'];
    const requestBody = mockGraphqlRequestBody({
      id: undefined,
      dryRun: true,
      displayName: undefined,
      heading: undefined,
      description: undefined,
      target: undefined,
      primary: undefined,
      fallback: undefined,
    });

    const response = mockGraphqlResponse({
      errors: [
        {
          message: 'Variable "id": Expected non-null, found null.',
        },
        {
          message: 'Variable "displayName": Expected non-null, found null.',
        },
      ],
    });

    githubHelpers.filterInstallPlans.mockReturnValueOnce(files);
    nrGraphqlHelpers.fetchNRGraphqlResults.mockReturnValue(response);
    helpers.passedProcessArguments.mockReturnValue(processArgs);

    const hasFailed = await createValidateUpdateInstallPlan(files);

    expect(hasFailed).toBe(true);

    expect(global.console.error).toHaveBeenCalled();
    expect(nrGraphqlHelpers.fetchNRGraphqlResults).toHaveBeenCalledWith(
      requestBody
    );
  });
});
