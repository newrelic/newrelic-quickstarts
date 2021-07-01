'use strict';
const helpers = require('../helpers');

describe('Action: validate images', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('getFileExtension, given a file of type .png, returns .png as the extension', () => {
    const input = 'test/file/ext.png';
    const output = helpers.getFileExtension(input);
    expect(output).toBe('.png');
  });

  test('getFileExtension, Given a directory path, returns an empty string as the extension', () => {
    const input = 'test/file/ext';
    const output = helpers.getFileExtension(input);
    expect(output).toBe('');
  });
});
