'use strict';

const {
  readDataSourceFile,
  readDataSourceFiles,
  parseInstallDirective,
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

  describe('transformInstallDirective', () => {
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
});
