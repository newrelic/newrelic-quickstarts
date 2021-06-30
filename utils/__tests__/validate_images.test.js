'use strict';
const { checkImageCounts, checkImageExtensions, checkFileSizes } = require('../validate_images');
const helpers = require('../helpers');
const glob = require('glob');
const path = require('path');
const isImage = require('is-image');
const fs = require("fs");


jest.mock('fs')
jest.mock('glob');
jest.spyOn(global.console, 'warn').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  getImageCount: jest.fn(),
  getFileSize: jest.fn(),
  globFiles: jest.fn(),
  isDirectory: jest.fn()
}))

const globMockSize = [ 'test/path/icon.png' ];

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('Given a file path, returns the extension of the file', () => {
    const input = 'test/file/ext.png'
    expect(helpers.getFileExtension(input)).toBe('.png');
  });

  test('Given a directory path, returns empty for file extension', () => {
    const input = 'test/file/ext'
    expect(helpers.getFileExtension(input)).toBe('');
  });

  test('Given allowed image size, does not throw an error', () => {
    isImage('test/path/config.png')
    helpers.getFileSize.mockReturnValueOnce(1000).mockReturnValueOnce(1000)
    helpers.isDirectory.mockReturnValueOnce(true)
    fs.statSync.mockReturnValueOnce('test/path/config.yml')

    checkFileSizes(globMockSize)
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('Given allowed image size, throws an error', () => {
    isImage('test/path/config.png')
    helpers.getFileSize.mockReturnValueOnce(500000000).mockReturnValueOnce(500000000)
    helpers.isDirectory.mockReturnValueOnce(true)
    fs.statSync.mockReturnValueOnce('test/path/config.yml')

    checkFileSizes(globMockSize)
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('Given allowed image extensions, does not throw an error', () => {
    const globMock = [ 'test/img/ext.png' ];
    checkImageExtensions(globMock)
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('Given allowed image extensions, throws an error', () => {
    const globMock = [ 'test/img/ext.webp' ];
    checkImageExtensions(globMock)
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  test('Given allowed number of images in a directory, does not throw an error', () => {
    const globMock = [ 'test/path/config' ];
    helpers.isDirectory.mockReturnValueOnce(true)
    helpers.getImageCount.mockReturnValueOnce(2).mockReturnValueOnce(2)

    checkImageCounts(globMock)
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  test('Given allowed number of images in a directory, throws an error', () => {
    const globMock = [ 'test/path/' ];
    helpers.isDirectory.mockReturnValueOnce(true)
    helpers.getImageCount.mockReturnValueOnce(10).mockReturnValueOnce(10)

    checkImageCounts(globMock)
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

});