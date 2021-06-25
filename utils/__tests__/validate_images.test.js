'use strict';
const validateImages = require('../validate_images');
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

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  it('should get file extension', () => {
    const input = 'test/file/ext.png'
    expect(helpers.getFileExtension(input)).toBe('.png');
  });

  it('should return no file extension', () => {
    const input = 'test/file/ext'
    expect(helpers.getFileExtension(input)).toBe('');
  });

  it('Should return correct file size', () => {
    helpers.globFiles.mockReturnValueOnce([ 'test/path/config.png' ]);
    isImage('test/path/config.png')
    helpers.getFileSize.mockReturnValueOnce(1000).mockReturnValueOnce(1000)
    helpers.isDirectory.mockReturnValueOnce(true)
    fs.statSync.mockReturnValueOnce('test/path/config.yml')

    validateImages()
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  it('Should return incorrect file size', () => {

    helpers.globFiles.mockReturnValueOnce([ 'test/path/config.png' ]);
    isImage('test/path/config.png')
    helpers.getFileSize.mockReturnValueOnce(500000000).mockReturnValueOnce(500000000)
    helpers.isDirectory.mockReturnValueOnce(true)
    fs.statSync.mockReturnValueOnce('test/path/config.yml')

    validateImages()
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  it('Should return correct extension', () => {
    helpers.globFiles.mockReturnValueOnce([ 'test/img/ext.png' ]);
    validateImages()
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  it('Should return incorrect extension', () => {
    helpers.globFiles.mockReturnValueOnce([ 'test/img/ext.webp' ]);
    validateImages()
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

  it('Should return correct number of images', () => {
    helpers.globFiles.mockReturnValueOnce([ 'test/path/config' ]);
    helpers.isDirectory.mockReturnValueOnce(true)
    helpers.getImageCount.mockReturnValueOnce(2).mockReturnValueOnce(2)

    validateImages()
    expect(global.console.warn).not.toHaveBeenCalled();
  });

  it('Should return correct number of images', () => {
    helpers.globFiles.mockReturnValueOnce([ 'test/path/' ]);
    helpers.isDirectory.mockReturnValueOnce(true)
    helpers.getImageCount.mockReturnValueOnce(10).mockReturnValueOnce(10)

    validateImages()
    expect(global.console.warn).toHaveBeenCalledTimes(2);
  });

});