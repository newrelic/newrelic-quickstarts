'use strict';
const {
  validateImageCounts,
  validateImageExtensions,
  validateFileSizes,
} = require('../validate_images');
const helpers = require('../helpers');
const core = require('@actions/core');
const fs = require('fs');
const glob = require('glob');
const path = require('path');

jest.mock('@actions/core');
jest.mock('fs');
jest.mock('glob');
jest.mock('path');
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  getImageCount: jest.fn(),
  getFileSize: jest.fn(),
  globFiles: jest.fn(),
  isDirectory: jest.fn(),
  readQuickstartFile: jest.fn(),
}));

const globMockSize = ['test/path/icon.png'];
const mockGlobSync = (files) => glob.sync.mockReturnValueOnce(files);
const mockPathResolve = (returnPath) =>
  path.resolve.mockReturnValue(returnPath);
const mockPathExtName = (ext) => path.extname.mockReturnValue(ext);

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validateFileSizes, given an image size of <= 4MB, does not throw an error', () => {
    helpers.getFileSize.mockReturnValueOnce(1000).mockReturnValueOnce(1000);
    helpers.isDirectory.mockReturnValueOnce(true);
    fs.statSync.mockReturnValueOnce('test/path/config.yml');
    mockPathExtName('.png');

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
    mockPathExtName('.png');

    validateFileSizes(globMockSize);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageExtensions, given an image with extension .png, does not throw an error', () => {
    const globMock = ['test/img/ext.png'];
    mockPathExtName('.png');

    validateImageExtensions(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageExtensions, given an image with extension .webp, throws an error', () => {
    const globMock = ['test/img/ext.webp'];
    mockPathExtName('.webp');

    validateImageExtensions(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given <= 6 image files per dashboard in a directory, does not throw an error', () => {
    const globMock = ['test/path/config'];
    mockGlobSync(['pineapple']);
    helpers.readQuickstartFile.mockReturnValue({ contents: [{}] });
    mockGlobSync(['2', 'dashboards']);
    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageCounts, given > 6 image files per dashboard in a directory, throws an error', () => {
    const globMock = ['test/path/'];
    mockGlobSync(['I', 'have', 'too', 'many', 'images', '>:)', '>:(']);
    helpers.readQuickstartFile.mockReturnValue({ contents: [{}] });
    mockGlobSync(['1 dashboard']);
    validateImageCounts(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given > 6 image files per dashboard in the images directory, throws an error', () => {
    const globMock = ['test/path/images/'];
    mockGlobSync(['I', 'have', 'too', 'many', 'images', '>:)', '>:(']);
    helpers.readQuickstartFile.mockReturnValue({ contents: [{}] });
    mockGlobSync(['1 dashboard']);

    validateImageCounts(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given 2 dashboards and > 6 image files per dashboard in the images directory, throws an error', () => {
    const globMock = ['test/path/'];
    mockGlobSync([
      'I',
      'have',
      'too',
      'many',
      'images',
      '>:)',
      'the',
      'max',
      'for',
      '2',
      'is',
      '12',
      '>:(',
    ]);
    helpers.readQuickstartFile.mockReturnValue({ contents: [{}] });
    mockGlobSync(['2', 'dashboards']);

    validateImageCounts(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given an icon, does not include the icon in image count', () => {
    const globMock = ['test/path/'];
    mockGlobSync(['just', 'enough', 'images', 'to', 'pass', ':)', 'icon']);
    helpers.readQuickstartFile.mockReturnValue({
      contents: [{ icon: 'icon' }],
    });
    mockPathResolve('icon');
    mockGlobSync(['1 dashboard']);

    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageCounts, given an icon, includes icon in count if config path does not match', () => {
    const globMock = ['test/path/'];
    mockGlobSync(['just', 'enough', 'images', 'to', 'pass', ':)', 'icon']);
    helpers.readQuickstartFile.mockReturnValue({
      contents: [{ icon: 'wrong/icon/path' }],
    });
    mockPathResolve('wrong/icon/path');
    mockGlobSync(['1 dashboard']);

    validateImageCounts(globMock);
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });
});
