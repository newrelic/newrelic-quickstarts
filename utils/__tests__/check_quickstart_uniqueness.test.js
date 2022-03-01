'use strict';
const checkQuickstartUniqueness = require('../check_quickstart_uniqueness');
const helpers = require('../helpers');

jest.mock('fs');
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  readQuickstartFile: jest.fn(),
  removeRepoPathPrefix: jest.fn(),
  findMainQuickstartConfigFiles: jest.fn(),
}));

describe('Action: check quickstart uniqueness', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('finds exact name match', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exactmatch' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'exactmatch' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds exact id match', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'unique', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'also-unique', id: '12345' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds match with different punctuation', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);

    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exact match' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: `e/xa"ct matc'h` }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds more than 2 name matches', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
    ]);
    helpers.readQuickstartFile
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

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(6);
  });

  test('finds more than 2 id matches', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'unique', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'also-unique', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'unique-too', id: '12345' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(6);
  });

  test('does not find match', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ name: 'exactmatch', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ name: 'not a match', id: '54321' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  test('finds and returns separate name matches', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
      'test/4/path/config.yml',
      'test/5/path/config.yml',
    ]);
    helpers.readQuickstartFile
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

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(7);
  });

  test('finds and returns separate id matches', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
      'test/3/path/config.yml',
      'test/4/path/config.yml',
      'test/5/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'test/path/config.yml',
        contents: [{ name: 'unique', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'test/2/path/config.yml',
        contents: [{ name: 'also-unique', id: '54321' }],
      })
      .mockReturnValueOnce({
        path: 'test/3/path/config.yml',
        contents: [{ name: 'unique-too', id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'test/4/path/config.yml',
        contents: [{ name: 'same-unique', id: '54321' }],
      })
      .mockReturnValueOnce({
        path: 'test/5/path/config.yml',
        contents: [{ name: 'uniqueness', id: '98765' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(7);
  });
});
