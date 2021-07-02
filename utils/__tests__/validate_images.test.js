'use strict';
const {
  validateImageCounts,
  validateImageExtensions,
  validateFileSizes,
} = require('../validate_images');
const helpers = require('../helpers');
const core = require('@actions/core');
const fs = require('fs');

jest.mock('@actions/core');
jest.mock('fs');
jest.mock('glob');
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  getImageCount: jest.fn(),
  getFileSize: jest.fn(),
  globFiles: jest.fn(),
  isDirectory: jest.fn(),
}));

const globMockSize = ['test/path/icon.png'];

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validateFileSizes, given an image size of <= 4MB, does not throw an error', () => {
    helpers.getFileSize.mockReturnValueOnce(1000).mockReturnValueOnce(1000);
    helpers.isDirectory.mockReturnValueOnce(true);
    fs.statSync.mockReturnValueOnce('test/path/config.yml');

    validateFileSizes(globMockSize);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateFileSizes, given an image size of > 4MB, throws an error', () => {
    helpers.getFileSize
      .mockReturnValueOnce(500000000)
      .mockReturnValueOnce(500000000);
    helpers.isDirectory.mockReturnValueOnce(true);
    fs.statSync.mockReturnValueOnce('test/path/config.yml');

    validateFileSizes(globMockSize);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageExtensions, given an image with extension .png, does not throw an error', () => {
    const globMock = ['test/img/ext.png'];

    validateImageExtensions(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageExtensions, given an image with extension .webp, throws an error', () => {
    const globMock = ['test/img/ext.webp'];

    validateImageExtensions(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given <= 6 image files in a directory, does not throw an error', () => {
    const globMock = ['test/path/config'];
    helpers.isDirectory.mockReturnValueOnce(true);
    helpers.getImageCount.mockReturnValueOnce(2).mockReturnValueOnce(2);

    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageCounts, given > 6 image files in a directory, throws an error', () => {
    const globMock = ['test/path/'];
    helpers.isDirectory.mockReturnValueOnce(true);
    helpers.getImageCount.mockReturnValueOnce(10).mockReturnValueOnce(10);

    validateImageCounts(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });
});
