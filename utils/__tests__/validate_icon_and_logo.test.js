'use strict';
const { expect, afterEach } = require('@jest/globals');
const fs = require('fs');

const helpers = require('../helpers');

const {
  validateIconAndLogo,
  handleErrors,
} = require('../validate_icons_and_logos');

jest.mock('../helpers');
jest.mock('fs');

describe('validate icon and logo tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateIconAndLogo', () => {
    test('returns no errors when icon and logo are not supplied', () => {
      helpers.readPackFile.mockReturnValueOnce({ contents: [{}] });

      const errorMessages = validateIconAndLogo(['fake_config_path']);

      expect(errorMessages).toStrictEqual([]);
    });

    test('returns no errors when icon and logo are supplied and exist', () => {
      helpers.readPackFile.mockReturnValueOnce({
        contents: [
          {
            icon: 'fake_icon_path',
            logo: 'fake_logo_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(true);

      const errorMessages = validateIconAndLogo(['fake_config_path']);

      expect(errorMessages.length).toBe(0);
    });

    test('returns icon errors when icon errors are detected', () => {
      helpers.readPackFile.mockReturnValueOnce({
        contents: [
          {
            icon: 'fake_icon_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);

      const [errorMessage] = validateIconAndLogo(['fake_config_path']);

      expect(errorMessage).toBe(
        'Icon for fake_config_path is supplied but does not exist at fake_icon_path'
      );
    });

    test('returns logo errors when logo errors are detected', () => {
      helpers.readPackFile.mockReturnValueOnce({
        contents: [
          {
            logo: 'fake_logo_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);

      const [errorMessage] = validateIconAndLogo(['fake_config_path']);

      expect(errorMessage).toBe(
        'Logo for fake_config_path is supplied but does not exist at fake_logo_path'
      );
    });

    test('returns icon and logo errors across multiple files', () => {
      helpers.readPackFile.mockReturnValue({
        contents: [
          {
            icon: 'fake_icon_path',
            logo: 'fake_logo_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);
      const mainConfigPaths = [
        'fake_config_path',
        'fake_config_path_2',
        'fake_config_path_3',
      ];

      const errorMessages = validateIconAndLogo(mainConfigPaths);

      console.warn(errorMessages);

      expect(errorMessages.length).toBe(6);
    });
  });

  describe('handleErrors', () => {
    test("when given empty array, prints success message and doesn't set exitCode", () => {
      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});

      handleErrors([]);

      expect(logMock).toHaveBeenCalledWith(
        'No errors found. Logo and icon validation passed.'
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
