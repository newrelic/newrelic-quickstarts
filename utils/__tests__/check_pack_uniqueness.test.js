'use strict';
const checkPackUniquess = require('../check_pack_uniqueness');
const helpers = require('../helpers');

jest.mock('fs');
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  readPackFile: jest.fn(),
  removeRepoPathPrefix: jest.fn(),
  findMainPackConfigFiles: jest.fn(),
}));

describe('Action: check pack uniqueness', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('finds exact match', () => {
    helpers.findMainPackConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readPackFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exactmatch' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'exactmatch' }],
      });

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds match with different punctuation', () => {
    helpers.findMainPackConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);

    helpers.readPackFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exact match' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: `e/xa"ct matc'h` }],
      });

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds more than 2 matches', () => {
    helpers.findMainPackConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
    ]);
    helpers.readPackFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exactmatch' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'exactmatch' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'exactmatch' }],
      });

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(6);
  });

  test('does not find match', () => {
    helpers.findMainPackConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readPackFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exactmatch' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'not a match' }],
      });

    checkPackUniquess();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  test('finds and returns separate matches', () => {
    helpers.findMainPackConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
      'test/4/path/config.yml',
      'test/5/path/config.yml',
    ]);
    helpers.readPackFile
      .mockReturnValueOnce({
        path: 'test/path/config.yml',
        contents: [{ name: 'match1' }],
      })
      .mockReturnValueOnce({
        path: 'test/2/path/config.yml',
        contents: [{ name: 'match2' }],
      })
      .mockReturnValueOnce({
        path: 'test/3/path/config.yml',
        contents: [{ name: 'match1' }],
      })
      .mockReturnValueOnce({
        path: 'test/4/path/config.yml',
        contents: [{ name: 'match2' }],
      })
      .mockReturnValueOnce({
        path: 'test/5/path/config.yml',
        contents: [{ name: 'match3' }],
      });

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(7);
  });
});
