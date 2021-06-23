'use strict';
const checkPackUniquess = require('../check_pack_uniqueness');
const helpers = require('../helpers');
const glob = require('glob');

jest.mock('fs');
jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});
jest.mock('../helpers', () => ({
  readFile: jest.fn(),
  removeCWDPrefix: jest.fn()
}))
jest.mock('glob');

describe('Action: check pack uniqueness', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('finds exact match', () => {
    glob.sync.mockReturnValueOnce([ 'test/path/config.yml', 'test/2/path/config.yml' ]); 
    helpers.readFile
      .mockReturnValueOnce({ path: 'testpath', contents: [{ name: 'exactmatch' }]})
      .mockReturnValueOnce({ path: 'testpathother', contents: [{ name: 'exactmatch' }]});

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds match with different punctuation', () => {
    glob.sync.mockReturnValueOnce([ 'test/path/config.yml', 'test/2/path/config.yml' ]); 

    helpers.readFile
      .mockReturnValueOnce({ path: 'testpath', contents: [{ name: 'exact match' }]})
      .mockReturnValueOnce({ path: 'testpathother', contents: [{ name: `e/xa"ct matc'h` }]});

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(5);
  });

  test('finds more than 2 matches', () => {

    console.dir(glob.sync, { depth: undefined });
    glob.sync.mockReturnValueOnce([ 'test/path/config.yml', 'test/2/path/config.yml', 'test/3/path/config.yml']);
    helpers.readFile
      .mockReturnValueOnce({ path: 'testpath', contents: [{ name: 'exactmatch' }]})
      .mockReturnValueOnce({ path: 'testpathother', contents: [{ name: 'exactmatch' }]})
      .mockReturnValueOnce({ path: 'testpathother', contents: [{ name: 'exactmatch' }]});

    checkPackUniquess();

    expect(global.console.log).not.toHaveBeenCalled();
    expect(global.console.error).toHaveBeenCalledTimes(6);
  });

  test('does not find match', () => {

    console.dir(glob.sync, { depth: undefined });
    glob.sync.mockReturnValueOnce([ 'test/path/config.yml', 'test/2/path/config.yml' ]);
    helpers.readFile
      .mockReturnValueOnce({ path: 'testpath', contents: [{ name: 'exactmatch' }]})
      .mockReturnValueOnce({ path: 'testpathother', contents: [{ name: 'not a match' }]});

    checkPackUniquess();

    expect(global.console.log).toHaveBeenCalled();
    expect(global.console.error).not.toHaveBeenCalled();
  });

});
