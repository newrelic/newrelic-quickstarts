'use strict';
import checkQuickstartUniqueness from '../check_quickstart_uniqueness';
import * as helpers from '../helpers';

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

  test('finds exact id match', () => {
    helpers.findMainQuickstartConfigFiles.mockReturnValueOnce([
      'test/path/config.yml',
      'test/2/path/config.yml',
    ]);
    helpers.readQuickstartFile
      .mockReturnValueOnce({
        path: 'testpath',
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ id: '12345' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
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
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ id: '12345' }],
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
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'testpathother',
        contents: [{ id: '54321' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
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
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'test/2/path/config.yml',
        contents: [{ id: '54321' }],
      })
      .mockReturnValueOnce({
        path: 'test/3/path/config.yml',
        contents: [{ id: '12345' }],
      })
      .mockReturnValueOnce({
        path: 'test/4/path/config.yml',
        contents: [{ id: '54321' }],
      })
      .mockReturnValueOnce({
        path: 'test/5/path/config.yml',
        contents: [{ id: '98765' }],
      });

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(7);
  });
});
