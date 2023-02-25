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
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.mock('../validate_images', () => ({
  ...jest.requireActual('../validate_images'),
}));

const globMockSize = ['test/path/logo.png'];
const mockGlobSync = (files) => glob.sync.mockReturnValueOnce(files);

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('validateFileSizes, given an image size of <= 4MB, does not throw an error', () => {
    fs.statSync.mockReturnValue({ size: 1000 });

    validateFileSizes(globMockSize);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateFileSizes, given an image size of > 4MB, throws an error', () => {
    fs.statSync.mockReturnValue({ size: 500000000 });

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

  test('validateImageCounts, given <= 12 image files per dashboard in a directory, does not throw an error', () => {
    const globMock = [{ configPath: 'test/path/config' }];

    mockGlobSync(['pineapple image']);
    mockGlobSync(['dashboards ID']);

    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('validateImageCounts, given > 12 image files per dashboard in a directory, throws an error', () => {
    const globMock = [{ configPath: 'test/path/' }];
    const images = Array(13).fill('img.png');

    mockGlobSync(images);
    mockGlobSync(['dashboard ID']);

    validateImageCounts(globMock);

    expect(core.setFailed).toHaveBeenCalled();
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });
});
