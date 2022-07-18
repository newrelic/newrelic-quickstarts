import * as path from 'path';
import * as fs from 'fs';

import Alert from '../Alert';
import { GITHUB_REPO_BASE_URL } from '../../constants';

// TODO: maybe there is an easier way to mock a single function on this library
jest.mock('fs', () => {
  const originalModule = jest.requireActual('fs');

  //Mock the default export and named export 'foo'
  return {
    __esModule: true,
    ...originalModule,
    readFileSync: jest.fn().mockImplementation(originalModule.readFileSync),
  };
});

jest.spyOn(global.console, 'log').mockImplementation(() => {});

const MOCK_FILES_BASEPATH = path.resolve(__dirname, '../../mock_files');

describe('Alert', () => {
  describe('constructor', () => {
    test('Creates valid Alert', () => {
      const alert = new Alert('mock-alert-policy-2', MOCK_FILES_BASEPATH);
      expect(alert.isValid).toBe(true);
      expect(alert.config).toBeDefined();
    });

    test('Creates invalid Alert when file does not exist', () => {
      const alert = new Alert('mock-alert-infinity', MOCK_FILES_BASEPATH);
      expect(alert.isValid).toBe(false);
      expect(alert.config).not.toBeDefined();
    });
  });

  describe('getConfigFilePath', () => {
    test('Creates valid configPath', () => {
      const alert = new Alert('mock-alert-policy-2', MOCK_FILES_BASEPATH);
      expect(alert.configPath).toEqual('alert-policies/mock-alert-policy-2');
      expect(alert.isValid).toBe(true);
    });

    test('Fails to create valid config path when alert policy does not exist', () => {
      const alert = new Alert('mock-alert-infinity', MOCK_FILES_BASEPATH);
      expect(alert.configPath).toEqual('');
      expect(alert.isValid).toBe(false);
    });

    test('Fails to create valid config path basePath is invalid', () => {
      const alert = new Alert('mock-alert-infinity', __dirname);
      expect(alert.configPath).toEqual('');
      expect(alert.isValid).toBe(false);
    });
  });

  describe('getConfigContent', () => {
    test('returns undefined if alert is invalid', () => {
      const alert = new Alert('', MOCK_FILES_BASEPATH);
      alert.isValid = false;
      expect(alert.getConfigContent()).not.toBeDefined();
    });

    test('returns undefined if alert cannot be found on the filesystem', () => {
      const alert = new Alert('', MOCK_FILES_BASEPATH);
      expect(alert.getConfigContent()).not.toBeDefined();
    });

    test('returns undefined if there is an error when reading from the filesystem', () => {
      fs.readFileSync.mockImplementationOnce(() => {
        throw new Error('test');
      });
      const alert = new Alert('mock-alert-policy-2', MOCK_FILES_BASEPATH);
      expect(alert.isValid).toBe(false);
      expect(console.log).toHaveBeenCalledTimes(1);
    });

    test('returns config for alert-policy with 1 condition', () => {
      const alert = new Alert('mock-alert-policy-1', MOCK_FILES_BASEPATH);
      const config = alert.getConfigContent();
      expect(config).toBeDefined();
      expect(config).toHaveLength(1);
    });

    test('returns config for alert-policy with more than 1 condition', () => {
      const alert = new Alert('mock-alert-policy-2', MOCK_FILES_BASEPATH);
      const config = alert.getConfigContent();
      expect(config).toBeDefined();
      expect(config).toHaveLength(2);
    });
  });

  describe('getMutationVariables', () => {
    test('returns empty array when there are no conditions', () => {
      const alert = new Alert('', MOCK_FILES_BASEPATH);
      const mutationVar = alert.getMutationVariables();
      expect(mutationVar).toHaveLength(0);
    });

    test('returns undefined values for missing alert configuration', () => {
      const alert = new Alert('mock-alert-policy-1', MOCK_FILES_BASEPATH);
      delete alert.config[0].name;
      delete alert.config[0].description;
      const mutationVar = alert.getMutationVariables();
      expect(mutationVar[0].displayName).not.toBeDefined();
      expect(mutationVar[0].description).not.toBeDefined();
    });

    test('returned string values are trimmed for whitespace', () => {
      const alert = new Alert('mock-alert-policy-1', MOCK_FILES_BASEPATH);
      alert.config[0].name = 'Blah      ';
      alert.config[0].description = '     test test';
      alert.config[0].type = 'STATIC  ';
      const mutationVar = alert.getMutationVariables();
      expect(mutationVar[0].displayName).toEqual('Blah');
      expect(mutationVar[0].description).toEqual('test test');
      expect(mutationVar[0].type).toEqual('STATIC');
    });

    test('returned values match alert configuration', () => {
      const mockPolicyJson = JSON.stringify({
        name: 'Errors',
        description:
          'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.\n',
        type: 'STATIC',
        nrql: {
          query:
            "from Transaction select percentage(count(*), where error is not false) as 'Errors' where transactionType = 'Web' facet appName",
        },
        valueFunction: 'SINGLE_VALUE',
        terms: [
          {
            priority: 'CRITICAL',
            operator: 'ABOVE',
            threshold: 10,
            thresholdDuration: 300,
            thresholdOccurrences: 'ALL',
          },
        ],
        expiration: {
          closeViolationsOnExpiration: true,
          openViolationOnExpiration: false,
          expirationDuration: 86400,
        },
        violationTimeLimitSeconds: 86400,
      });
      const alert = new Alert('mock-alert-policy-1', MOCK_FILES_BASEPATH);
      const mutationVar = alert.getMutationVariables();

      expect(mutationVar[0].displayName).toEqual('Errors');
      expect(mutationVar[0].description).toEqual(
        'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.'
      );
      expect(mutationVar[0].type).toEqual('STATIC');
      expect(mutationVar[0].sourceUrl).toEqual(
        `${GITHUB_REPO_BASE_URL}/alert-policies/mock-alert-policy-1`
      );
      expect(mutationVar[0].rawConfiguration).toEqual(mockPolicyJson);
    });

    test('returned values match alert configuration with more than one condition', () => {
      const mockPolicyErrorJson = JSON.stringify({
        name: 'Errors',
        description:
          'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.\n',
        type: 'STATIC',
        nrql: {
          query:
            "from Transaction select percentage(count(*), where error is not false) as 'Errors' where transactionType = 'Web' facet appName",
        },
        valueFunction: 'SINGLE_VALUE',
        terms: [
          {
            priority: 'CRITICAL',
            operator: 'ABOVE',
            threshold: 10,
            thresholdDuration: 300,
            thresholdOccurrences: 'ALL',
          },
        ],
        expiration: {
          closeViolationsOnExpiration: true,
          openViolationOnExpiration: false,
          expirationDuration: 86400,
        },
        violationTimeLimitSeconds: 86400,
      });

      const mockPolicyHealthJson = JSON.stringify({
        name: 'Cluster Health',
        description:
          "This alert triggers when the reported health of an Elasticsearch cluster is 'red'.\n",
        type: 'STATIC',
        nrql: {
          query:
            "FROM ElasticsearchClusterSample SELECT uniqueCount(displayName) WHERE cluster.status = 'red' FACET displayName",
        },
        valueFunction: 'SINGLE_VALUE',
        terms: [
          {
            priority: 'CRITICAL',
            operator: 'ABOVE',
            threshold: 0,
            thresholdDuration: 300,
            thresholdOccurrences: 'AT_LEAST_ONCE',
          },
        ],
        violationTimeLimitSeconds: 86400,
      });
      const alert = new Alert('mock-alert-policy-2', MOCK_FILES_BASEPATH);
      const mutationVar = alert.getMutationVariables();

      // Cluster Health policy
      expect(mutationVar[0].displayName).toEqual('Cluster Health');
      expect(mutationVar[0].description).toEqual(
        "This alert triggers when the reported health of an Elasticsearch cluster is 'red'."
      );
      expect(mutationVar[0].type).toEqual('STATIC');
      expect(mutationVar[0].sourceUrl).toEqual(
        `${GITHUB_REPO_BASE_URL}/alert-policies/mock-alert-policy-2`
      );
      expect(mutationVar[0].rawConfiguration).toEqual(mockPolicyHealthJson);

      // Errors policy
      expect(mutationVar[1].displayName).toEqual('Errors');
      expect(mutationVar[1].description).toEqual(
        'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.'
      );
      expect(mutationVar[1].type).toEqual('STATIC');
      expect(mutationVar[1].sourceUrl).toEqual(
        `${GITHUB_REPO_BASE_URL}/alert-policies/mock-alert-policy-2`
      );
      expect(mutationVar[1].rawConfiguration).toEqual(mockPolicyErrorJson);
    });
  });
});
