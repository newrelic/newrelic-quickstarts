'use strict';

const {
  readDataSourceFile,
  readDataSourceFiles,
} = require('../create-validate-data-sources');

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

const mockDataSource = 'utils/mock_files/mock-data-source-1/config.yml';

describe('create-validate-data-sources', () => {
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
});
