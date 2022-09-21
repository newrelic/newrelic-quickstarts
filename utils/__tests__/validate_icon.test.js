'use strict';
import { expect, afterEach } from '@jest/globals';
import * as fs from 'fs';

import { validateIcon, handleErrors } from '../validate_icons';

jest.mock('fs');

describe('validate Icon tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateIcon', () => {
    test('returns no icon found when Icon is not supplied', () => {
      const errorMessages = validateIcon([
        {
          isValid: true,
          basePath: '/path/repos/newrelic-quickstarts',
          identifier: 'quickstarts/test-quickstart/config.yml',
          configPath:
            '/Users/mickeyryan/repos/newrelic-quickstarts/quickstarts/test-quickstart/config.yml',
          config: {
            id: '123',
            title: 'Test quickstart',
          },
          components: [],
        },
      ]);

      expect(errorMessages).toStrictEqual([
        'No icon found for Test quickstart',
      ]);
    });

    test('returns no errors when Icon is supplied and exists', () => {
      fs.existsSync.mockReturnValue(true);
      const errorMessages = validateIcon([
        {
          isValid: true,
          basePath: '/path/newrelic-quickstarts',
          identifier: 'quickstarts/test-quickstart/config.yml',
          getConfigFilePath: jest.fn().mockImplementation(() => 'test/path'),
          configPath:
            '/path/newrelic-quickstarts/quickstarts/test-quickstart/config.yml',
          config: {
            id: '123',
            title: 'Test quickstart',
            icon: 'logo.svg',
          },

          components: [],
        },
      ]);

      expect(errorMessages.length).toBe(0);
    });

    test('returns icon errors when icon errors are detected', () => {
      fs.existsSync.mockReturnValue(false);
      const [errorMessage] = validateIcon([
        {
          isValid: true,
          basePath: '/path/newrelic-quickstarts',
          identifier: 'quickstarts/test-quickstart/config.yml',
          getConfigFilePath: jest.fn().mockImplementation(() => 'test/path'),
          configPath:
            '/path/newrelic-quickstarts/quickstarts/test-quickstart/config.yml',
          config: {
            id: '123',
            title: 'fake_config_path',
            icon: 'logo.svg',
          },

          components: [],
        },
      ]);

      expect(errorMessage).toBe(
        'Icon for test is supplied but does not exist at test/logo.svg'
      );
    });

    test('returns icon errors across multiple files', () => {
      fs.existsSync.mockReturnValue(false);

      const errorMessages = validateIcon([
        {
          isValid: true,
          basePath: '/path/newrelic-quickstarts',
          identifier: 'quickstarts/test-quickstart/config.yml',
          getConfigFilePath: jest.fn().mockImplementation(() => 'test/path'),
          configPath:
            '/path/newrelic-quickstarts/quickstarts/test-quickstart/config.yml',
          config: {
            id: '123',
            title: 'fake_config_path',
            icon: 'logo.svg',
          },

          components: [],
        },
        {
          isValid: true,
          basePath: '/path/newrelic-quickstarts',
          identifier: 'quickstarts/other/test-quickstart/config.yml',
          getConfigFilePath: jest.fn().mockImplementation(() => 'test/path'),
          configPath:
            '/path/newrelic-quickstarts/quickstarts/other/test-quickstart/config.yml',
          config: {
            id: '123',
            title: 'fake_config_path',
            icon: 'logo.svg',
          },

          components: [],
        },
      ]);

      expect(errorMessages.length).toBe(2);
    });
  });

  describe('handleErrors', () => {
    test("when given empty array, prints success message and doesn't set exitCode", () => {
      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});

      handleErrors([]);

      expect(logMock).toHaveBeenCalledWith(
        'No errors found. Icon validation passed.'
      );
      expect(process.exitCode).toBe(undefined);
    });

    test('when given errors, prints each error and sets exitCode to 1', () => {
      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});

      handleErrors(['error1', 'error2', 'error3', 'error4']);

      expect(logMock).toBeCalledTimes(4);
      expect(process.exitCode).toBe(1);
    });
  });
});
