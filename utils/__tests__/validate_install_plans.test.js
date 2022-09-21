'use strict';

import { getInstallPlanId } from '../create-validate-install-plans';

import * as fs from 'fs';

jest.mock('@actions/core');
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.spyOn(fs, 'readFileSync');

jest.mock('../lib/github-api-helpers', () => ({
  ...jest.requireActual('../lib/github-api-helpers'),
  filterInstallPlans: jest.fn(),
}));

jest.mock('../lib/nr-graphql-helpers', () => ({
  ...jest.requireActual('../lib/nr-graphql-helpers'),
  fetchNRGraphqlResults: jest.fn(),
}));

const validInstallFilename =
  'utils/mock_files/install/mock-install-1/install.yml';
const invalidInstallFilename1 =
  'utils/mock_files/install/invalid-mock-install-2/install.yml';

describe('create-validate-install-plans', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getInstallPlanId should return id for valid path', async () => {
    expect(getInstallPlanId(validInstallFilename)).toBe('mock-install-1');
  });

  test('errors with invalid install plan', async () => {
    expect(getInstallPlanId(invalidInstallFilename1)).toBe('');
    expect(fs.readFileSync).not.toHaveBeenCalled();
  });
});
