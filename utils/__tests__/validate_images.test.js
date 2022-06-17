'use strict';
import {
  validateImageCounts,
  validateImageExtensions,
  validateFileSizes,
  getFileSize,
} from '../validate_images';
import * as core from '@actions/core';
import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

jest.mock('@actions/core');
jest.mock('fs', () => ({
  promises: {
    access: jest.fn(),
  },
  statSync: jest.fn(),
}));

jest.mock('glob');
jest.mock('path');
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.mock('../validate_images', () => ({
  ...jest.requireActual('../validate_images'),
  getFileSize: jest.fn(),
}));

const globMockSize = ['test/path/logo.png'];
const mockGlobSync = (files) => glob.sync.mockReturnValueOnce(files);
const mockPathExtName = (ext) => path.extname.mockReturnValue(ext);

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validateFileSizes, given an image size of <= 4MB, does not throw an error', () => {
    getFileSize.mockReturnValueOnce(1000);

    fs.statSync.mockReturnValueOnce('test/path/config.yml');
    mockPathExtName('.png');

    validateFileSizes(globMockSize);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test.only('validateFileSizes, given an image size of > 4MB, throws an error', () => {
    getFileSize
      .mockReturnValueOnce(500000000);

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

  test('validateImageCounts, given <= 12 image files per dashboard in a directory, does not throw an error', () => {
    const globMock = ['test/path/config'];

    mockGlobSync(['pineapple']);
    mockGlobSync(['2', 'dashboards']);

    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageCounts, given > 12 image files per dashboard in a directory, throws an error', () => {
    const globMock = ['test/path/'];
    const images = Array.from('img'.repeat(13));

    mockGlobSync(images);
    mockGlobSync(['1 dashboard']);

    validateImageCounts(globMock);
    
    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given > 12 image files per dashboard in the images directory, throws an error', () => {
    const globMock = ['test/path/images/'];
    const images = Array.from('img'.repeat(13));

    mockGlobSync(images);
    mockGlobSync(['1 dashboard']);

    validateImageCounts(globMock);

    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImageCounts, given 2 dashboards and > 12 image files per dashboard in the images directory, throws an error', () => {
    const globMock = ['test/path/'];
    const images = Array.from('img'.repeat(25));

    mockGlobSync(images);
    mockGlobSync(['2', 'dashboards']);

    validateImageCounts(globMock);

    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('validateImagaCounts, given 0 dashboads, does not throw an error', () => {
    const globMock = [
      path.resolve(__dirname, '../mock_files/mock-quickstarts/mock-quickstart-6/config.yml'),
    ];
    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

});
