'use strict';
const { expect, afterEach } = require('@jest/globals');
const fs = require('fs');

const helpers = require('../helpers');

const { validateLogo, handleErrors } = require('../validate_logos');

jest.mock('../helpers');
jest.mock('fs');

describe('validate logo tests', () => {
  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe('validateLogo', () => {
    test('returns no errors when logo is not supplied', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({ contents: [{}] });

      const errorMessages = validateLogo(['fake_config_path']);

      expect(errorMessages).toStrictEqual([]);
    });

    test('returns no errors when logo is supplied and exists', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({
        contents: [
          {
            logo: 'fake_logo_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(true);

      const errorMessages = validateLogo(['fake_config_path']);

      expect(errorMessages.length).toBe(0);
    });

    test('returns logo errors when logo errors are detected', () => {
      helpers.readQuickstartFile.mockReturnValueOnce({
        contents: [
          {
            logo: 'fake_logo_path',
          },
        ],
      });
      fs.existsSync.mockReturnValue(false);

      const [errorMessage] = validateLogo(['fake_config_path']);

      expect(errorMessage).toBe(
        'Logo for fake_config_path is supplied but does not exist at fake_logo_path'
      );
    });

    test('returns logo errors across multiple files', () => {
      helpers.readQuickstartFile.mockReturnValue({
        contents: [
          {
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

      const errorMessages = validateLogo(mainConfigPaths);

      expect(errorMessages.length).toBe(3);
    });
  });

  describe('handleErrors', () => {
    test("when given empty array, prints success message and doesn't set exitCode", () => {
      const logMock = jest.spyOn(console, 'log').mockImplementation(() => {});

      handleErrors([]);

      expect(logMock).toHaveBeenCalledWith(
        'No errors found. Logo validation passed.'
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
