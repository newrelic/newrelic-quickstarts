'use strict';
const { expect, afterEach } = require('@jest/globals');
const fs = require('fs');

const helpers = require('../helpers');

const { validateIcon, handleErrors } = require('../validate_icons');

jest.mock('../helpers');
jest.mock('fs');

describe('validate icon tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateIcon', () => {
    test('returns no errors when icon is not supplied', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({ contents: [{}] });

      const errorMessages = validateIcon(['fake_config_path']);

      expect(errorMessages).toStrictEqual([]);
    });

    test('returns no errors when icon is supplied and exists', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({
        contents: [
          {
            icon: 'fake_icon_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(true);

      const errorMessages = validateIcon(['fake_config_path']);

      expect(errorMessages.length).toBe(0);
    });

    test('returns icon errors when icon errors are detected', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({
        contents: [
          {
            icon: 'fake_icon_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);

      const [errorMessage] = validateIcon(['fake_config_path']);

      expect(errorMessage).toBe(
        'Icon for fake_config_path is supplied but does not exist at fake_icon_path'
      );
    });

    test('returns icon errors across multiple files', () => {
      helpers.readQuickstartFile.mockReturnValue({
        contents: [
          {
            icon: 'fake_icon_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);
      const mainConfigPaths = [
        'fake_config_path',
        'fake_config_path_2',
        'fake_config_path_3',
      ];

      const errorMessages = validateIcon(mainConfigPaths);

      expect(errorMessages.length).toBe(3);
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
