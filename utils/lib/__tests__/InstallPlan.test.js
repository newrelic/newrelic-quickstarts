import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import InstallPlan from '../InstallPlan';
const MOCK_FILES_BASEPATH = path.resolve(__dirname, '../../mock_files');

const mockInstall3 = yaml.load(
  fs
    .readFileSync(
      path.resolve(
        __dirname,
        '../../mock_files/install/mock-install-3/install.yml'
      )
    )
    .toString('utf-8')
);

describe('InstallPlan', () => {
  describe('getConfigFilePath', () => {
    test('should return a valid path to the config file', () => {
      const plan = new InstallPlan('mock-install-1', MOCK_FILES_BASEPATH);

      expect(plan.isValid).toBeTruthy();
    });

    test('should set valid to false if the config file can not be found', () => {
      const plan = new InstallPlan('foobar');

      expect(plan.isValid).toBeFalsy();
      expect(plan.configPath).toEqual('');
    });
  });

  describe('getConfigContent', () => {
    test('should return config if valid', () => {
      const plan = new InstallPlan('test-install-install', MOCK_FILES_BASEPATH);

      expect(plan.isValid).toBeTruthy();
    });
  });

  describe('getMutationVariables', () => {
    test('returns id of install plan', () => {
      const install = new InstallPlan('mock-install-1', MOCK_FILES_BASEPATH);
      expect(install.getMutationVariables()).toEqual('mock-install-1');
    });
  });

  describe('_getComponentMutationVariables', () => {
    test('returns correct mutation variables for valid install plan', () => {
      const install = new InstallPlan(
        'test-install-install',
        MOCK_FILES_BASEPATH
      );
      const vars = install._getComponentMutationVariables(true);
      expect(vars).toEqual({
        id: mockInstall3.id,
        dryRun: true,
        description: mockInstall3.description,
        displayName: mockInstall3.name,
        target: {
          destination: mockInstall3.target.destination?.toUpperCase(),
          os: mockInstall3.target.os?.map((s) => s.toUpperCase()),
          type: mockInstall3.target.type?.toUpperCase(),
        },
        heading: mockInstall3.title,
        primary: {
          targeted: {
            recipeName: mockInstall3.install.destination.recipeName,
          },
        },
        fallback: {
          link: { url: mockInstall3.fallback.destination.url },
        },
      });
    });

    test('returns variables for invalid install plan', () => {
      const install = new InstallPlan('mock-fake', MOCK_FILES_BASEPATH);
      const vars = install._getComponentMutationVariables(true);
      expect(vars).toEqual({
        id: undefined,
        dryRun: true,
        description: undefined,
        displayName: undefined,
        target: undefined,
        heading: undefined,
        primary: undefined,
        fallback: undefined,
      });
    });
  });
});
