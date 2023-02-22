import DataSource from '../DataSource';
import * as path from 'path';
import * as fs from 'fs';

import { GITHUB_RAW_BASE_URL } from '../../constants';

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

// jest.spyOn(global.console, 'log').mockImplementation(() => {});
// jest.spyOn(global.console, 'error').mockImplementation(() => {});

const MOCK_FILES_BASEPATH = path.resolve(__dirname, '../../mock_files');

describe('DataSource', () => {
  describe('constructor', () => {
    test('Creates valid DataSource', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      expect(source.isValid).toBe(true);
      expect(source.config).toBeDefined();
      expect(source.identifier).toBe('mock-data-source-1');
    });

    test('Creates valid CORE DataSource', () => {
      const source = new DataSource('nodejs', MOCK_FILES_BASEPATH, ['nodejs']);
      expect(source.isValid).toBe(true);
      expect(source.config).toBeDefined();
      expect(source.identifier).toBe('nodejs');
    });

    test('Creates invalid CORE DataSource when identifier is invalid', () => {
      const source = new DataSource('not-an-id', MOCK_FILES_BASEPATH, [
        'nodejs',
      ]);
      expect(source.isValid).toBe(false);
      expect(source.config).not.toBeDefined();
    });

    test('Creates invalid DataSource when file does not exist', () => {
      const source = new DataSource(
        'mock-data-source-infinity',
        MOCK_FILES_BASEPATH
      );
      expect(source.isValid).toBe(false);
      expect(source.config).not.toBeDefined();
    });
  });

  describe('getConfigFilePath', () => {
    test('Creates valid configPath', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      expect(source.configPath).toEqual(
        'data-sources/mock-data-source-1/config.yml'
      );
      expect(source.isValid).toBe(true);
    });

    test('Fails to create valid config path when datasource does not exist', () => {
      const source = new DataSource(
        'mock-data-source-infinite',
        MOCK_FILES_BASEPATH
      );
      expect(source.configPath).toEqual('');
      expect(source.isValid).toBe(false);
    });

    test('Fails to create valid config path, basePath is invalid', () => {
      const source = new DataSource('test-data-source', __dirname);
      expect(source.configPath).toEqual('');
      expect(source.isValid).toBe(false);
    });
  });

  describe('getConfigContent', () => {
    test('returns undefined if datasource is invalid', () => {
      const source = new DataSource('', MOCK_FILES_BASEPATH);
      source.isValid = false;
      expect(source.getConfigContent()).not.toBeDefined();
    });

    test('returns undefined if datasource cannot be found on the filesystem', () => {
      const source = new DataSource('', MOCK_FILES_BASEPATH);
      expect(source.getConfigContent()).not.toBeDefined();
    });

    test('returns config for datasource', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const config = source.getConfigContent();
      expect(config).toBeDefined();
      expect(config.id).toEqual('test-data-source');
      expect(config.displayName).toEqual('Test Data Source');
      expect(config.description).toEqual('test\n');
    });
  });

  describe('_getComponentMutationVariables', () => {
    test('returned string values are trimmed for whitespace', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      source.config.displayName = 'Blah      ';
      source.config.description = '     test test';
      source.config.keywords = ['   test   '];
      source.config.categoryTerms = ['   test'];
      const mutationVar = source._getComponentMutationVariables();
      expect(mutationVar.dataSourceMetadata.displayName).toEqual('Blah');
      expect(mutationVar.dataSourceMetadata.description).toEqual('test test');
      expect(mutationVar.dataSourceMetadata.keywords).toEqual(['test']);
      expect(mutationVar.dataSourceMetadata.categoryTerms).toEqual(['test']);
    });

    test('dryRun flag is passed to mutation variables', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const mutationVar = source._getComponentMutationVariables(false);
      expect(mutationVar.dryRun).toBe(false);
    });

    test('dryRun flag defaults to true', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const mutationVar = source._getComponentMutationVariables();
      expect(mutationVar.dryRun).toBe(true);
    });

    test('returned values match datasource configuration', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const mutationVar = source._getComponentMutationVariables();

      expect(mutationVar.id).toEqual('test-data-source');
      expect(mutationVar.dataSourceMetadata.displayName).toEqual(
        'Test Data Source'
      );
      expect(mutationVar.dataSourceMetadata.description).toEqual('test');
      expect(mutationVar.dataSourceMetadata.keywords).toEqual([
        'test',
        'keyword2',
      ]);
      expect(mutationVar.dataSourceMetadata.categoryTerms).toEqual([
        'test',
        'term2',
      ]);
      expect(mutationVar.dataSourceMetadata.install).toEqual({
        primary: {
          nerdlet: {
            nerdletId: 'test.test-nerdlet',
            nerdletState: JSON.stringify({
              test_state: 'test',
            }),
            requiresAccount: true,
          },
        },
        fallback: {
          link: {
            url: 'https://newrelic.com',
          },
        },
      });
    });
  });
  describe('_parseInstall', () => {
    test('properly parses install', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const install = source._parseInstall();

      expect(install.primary).toBeDefined();
      expect(install.fallback).toBeDefined();
    });
    test('properly parses install without fallback', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const install = source._parseInstall();
      delete install.fallback;

      expect(install.primary).toBeDefined();
      expect(install.fallback).toBeUndefined();
    });
  });
  describe('_getIconUrl', () => {
    test('returns correct url', () => {
      const source = new DataSource('test-data-source', MOCK_FILES_BASEPATH);
      const iconUrl = source._getIconUrl();

      expect(iconUrl).toEqual(
        `${GITHUB_RAW_BASE_URL}/data-sources/mock-data-source-1/icon.png`
      );
    });
  });
});
