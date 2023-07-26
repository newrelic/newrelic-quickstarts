'use strict';
import {
  checkLine,
  createWarningComment,
  runHelper,
  getLines,
  getWarnings,
} from '../dashboard-helper';
import * as ghHelpers from '../lib/github-api-helpers';
import * as core from '@actions/core';
import fetch from 'node-fetch';

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.spyOn(core, 'setOutput');
jest.mock('../lib/github-api-helpers', () => {
  return {
    ...jest.requireActual('../lib/github-api-helpers'),
    fetchPaginatedGHResults: jest.fn(),
  };
});
jest.mock('node-fetch');

describe('dashboard-helper', () => {
  describe('getWarnings', () => {
    test('handles empty string input', () => {
      expect(getWarnings('')).toHaveLength(0);
    });

    test('finds guid', () => {
      expect(getWarnings(`(entity.guid)`)).toHaveLength(1);
    });

    test('finds entityGuid', () => {
      expect(getWarnings({'entityGuid': 1234})).toHaveLength(1);
    });

    test('finds linkedEntityGuids', () => {
      expect(getWarnings({"linkedEntityGuids":123456})).toHaveLength(1);
    });

    test('does not find null linkedEntityGuids', () => {
      expect(getWarnings({"linkedEntityGuids":null})).toHaveLength(0);
    });

    test('finds permissions field', () => {
      expect(getWarnings({"permissions":test})).toHaveLength(1);
    });

    test('finds accountId', () => {
      expect(getWarnings({"accountId":123456})).toHaveLength(1);
    });

    test('does not find accountId equal to zero', () => {
      expect(getWarnings({"accountId":0})).toHaveLength(0);
    });

    test('finds accountIds', () => {
      expect(getWarnings({"accountIds":[  31415  ]})).toHaveLength(1);
    });

    test('does not find accountIds equal to []', () => {
      expect(getWarnings({"accountIds":[]})).toHaveLength(0);
    });

    test('finds warnings across multiple lines', () => {
      const multiLine = {
        "accountIds": [ 
          12345678 
        ],
      }
      expect(getWarnings(multiLine)).toHaveLength(1);
    });    
  });

  describe('createWarningComment', () => {
    test('creates comment', () => {
      const warnings = ['test string | test file'];
      const testComment = createWarningComment(warnings);
      expect(testComment).toContain(warnings[0]);
      expect(testComment).toContain(
        '### The PR checks have run and found the following warnings:'
      );
    });
  });

  describe('runHelper', () => {
    afterEach(() => {
      jest.resetAllMocks();
    });

    test('exits if github token is undefined', async () => {
      expect(await runHelper('PR_url')).toBe(false);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('exits if PR url is undefined', async () => {
      expect(await runHelper(undefined, 'token')).toBe(false);
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('outputs comment', async () => {
      ghHelpers.fetchPaginatedGHResults.mockResolvedValueOnce([
        {
          filename: 'dashboards/cool-dash/cool-dash.json',
          raw_url: 'raw-url/dashboards/cool-dash/cool-dash.json',
          status: 'added',
        },
      ]);

      fetch.mockResolvedValueOnce({
        json: () => ({
          permissions: [],
        }),
        ok: true,
      });

      const output = await runHelper('http://localhost', 'token');
      expect(output).toBe(true);
      expect(fetch).toHaveBeenCalledWith(
        'raw-url/dashboards/cool-dash/cool-dash.json',
        { headers: { authorization: 'token token' } }
      );
      expect(core.setOutput).toHaveBeenCalledWith(
        'comment',
        '### The PR checks have run and found the following warnings:\n\n| Warning | Filepath | \n| --- | --- | \n| "permissions" field should not be used | dashboards/cool-dash/cool-dash.json |\n\nReference the [Contributing Docs for Dashboards](https://github.com/newrelic/newrelic-quickstarts/blob/main/CONTRIBUTING.md#dashboards) for more information. \n'
      );
    });

    test('handles network error;', async () => {
      ghHelpers.fetchPaginatedGHResults.mockResolvedValueOnce([
        {
          filename: 'dashboards/cool-dash/cool-dash.json',
          status: 'added',
        },
      ]);

      fetch.mockRejectedValueOnce({
        json: () => ({
          permissions: [],
        }),
      });
      const output = await runHelper('http://localhost', 'token');
      expect(output).toBe(false);
    });

    test('handles non 200 status code;', async () => {
      ghHelpers.fetchPaginatedGHResults.mockResolvedValueOnce([
        {
          filename: 'dashboards/cool-dash/cool-dash.json',
          raw_url: 'raw-url/dashboards/cool-dash/cool-dash.json',
          status: 'added',
        },
      ]);

      fetch.mockResolvedValueOnce({
        ok: false,
        status: 404,
      });
      const output = await runHelper('http://localhost', 'token');
      expect(output).toBe(false);
      expect(console.error).toHaveBeenCalledWith(
        'Error:',
        '404 - raw-url/dashboards/cool-dash/cool-dash.json'
      );
    });
  });
});
