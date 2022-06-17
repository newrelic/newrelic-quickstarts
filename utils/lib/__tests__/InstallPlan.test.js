import * as glob from 'glob';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import InstallPlan from '../InstallPlan';

describe('InstallPlan', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('getConfigFilePath', () => {
    beforeEach(() => {
      fs.readFileSync = jest.fn(() => ({ toString: jest.fn() }));
      yaml.load = jest.fn();
    });

    test('should return a valid path to the config file', () => {
      glob.sync = jest.fn(() => ['install/foobar/install.yml']);

      const plan = new InstallPlan('foobar');

      expect(plan.isValid).toBeTruthy();
    });

    test('should set valid to false if the config file can not be found', () => {
      glob.sync = jest.fn(() => []);

      const plan = new InstallPlan('foobar');

      expect(plan.isValid).toBeFalsy();
      expect(plan.configPath).toEqual('');
    });
  });

  describe('getConfigContent', () => {
    test('should not attempt to read a file if invalid', () => {
      fs.readFileSync = jest.fn();
      glob.sync = jest.fn(() => []);

      new InstallPlan('foobar');

      expect(fs.readFileSync).not.toHaveBeenCalled();
    });

    test('should return config if valid', () => {
      glob.sync = jest.fn(() => ['install/foobar/install.yml']);
      fs.readFileSync = jest.fn(() => ({ toString: jest.fn() }));
      yaml.load = jest.fn(() => ({ foo: 'bar' }));

      const plan = new InstallPlan('foobar');

      expect(plan.isValid).toBeTruthy();
    });

    test('should set valid to false if unable to read file', () => {
      glob.sync = jest.fn(() => ['install/foobar/install.yml']);
      fs.readFileSync = jest.fn(() => {
        throw 'Unable to find file';
      });

      const plan = new InstallPlan('foobar');

      expect(plan.isValid).toBeFalsy();
      expect(plan.config).toBeUndefined();
    });
  });
});
