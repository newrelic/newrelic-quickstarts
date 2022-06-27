'use strict';
import checkQuickstartUniqueness from '../check_quickstart_uniqueness';
import Quickstart from '../lib/Quickstart';

jest.mock('fs');
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

describe('Action: check quickstart uniqueness', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('finds exact id match', () => {
    const mockGetAll = jest.fn().mockReturnValueOnce([
      { configPath: 'test/path/config.yml', config: { id: 12345 } },
      { configPath: 'test/2/path/config.yml', config: { id: 12345 } },
    ]);
    Quickstart.getAll = mockGetAll;
    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds more than 2 id matches', () => {
    const mockGetAll = jest.fn().mockReturnValueOnce([
      { configPath: 'test/path/config.yml', config: { id: 12345 } },
      { configPath: 'test/2/path/config.yml', config: { id: 12345 } },
      { configPath: 'test/3/path/config.yml', config: { id: 12345 } },
    ]);
    Quickstart.getAll = mockGetAll;

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(6);
  });

  test('does not find match', () => {
    const mockGetAll = jest.fn().mockReturnValueOnce([
      { configPath: 'test/path/config.yml', config: { id: 12345 } },
      { configPath: 'test/2/path/config.yml', config: { id: 23456} },
      { configPath: 'test/3/path/config.yml', config: { id: 34567} },
    ]);
    Quickstart.getAll = mockGetAll;

    checkQuickstartUniqueness();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

  test('finds and returns separate id matches', () => {
    const mockGetAll = jest.fn().mockReturnValueOnce([
      { configPath: 'test/path/config.yml', config: { id: 12345 } },
      { configPath: 'test/2/path/config.yml', config: { id: 23456} },
      { configPath: 'test/3/path/config.yml', config: { id: 12345} },
      { configPath: 'test/4/path/config.yml', config: { id: 23456} },
      { configPath: 'test/4/path/config.yml', config: { id: 98765} },
    ]);

    Quickstart.getAll = mockGetAll

    checkQuickstartUniqueness();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(7);
  });
});
