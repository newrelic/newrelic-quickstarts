'use strict';
import {
  checkLine,
  createWarningComment,
  runHelper,
} from '../dashboard-helper';
import * as ghHelpers from '../lib/github-api-helpers';
import fetch from 'node-fetch';

jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log').mockImplementation(() => {});
jest.mock('../lib/github-api-helpers', () => {
  return {
    ...jest.requireActual('../lib/github-api-helpers'),
    fetchPaginatedGHResults: jest.fn(),
  };
});
jest.mock('node-fetch');

describe('dashboard-helper', () => {
  describe('checkLine', () => {
    test('handles empty string input', () => {
      expect(checkLine('')).toHaveLength(0);
    });

    test('finds guid', () => {
      expect(checkLine(`(entity.guid)`)).toHaveLength(1);
    });

    test('finds entityGuid', () => {
      expect(checkLine(`entityGuid`)).toHaveLength(1);
    });

    test('finds linkedEntityGuids', () => {
      expect(checkLine(`"linkedEntityGuids": 123456`)).toHaveLength(1);
    });

    test('does not find null linkedEntityGuids', () => {
      expect(checkLine(`"linkedEntityGuids": null`)).toHaveLength(0);
    });

    test('finds permissions field', () => {
      expect(checkLine(`"permissions": test`)).toHaveLength(1);
    });

    test('finds accountId', () => {
      expect(checkLine(`"accountId": 123456`)).toHaveLength(1);
    });

    test('does not find accountId equal to zero', () => {
      expect(checkLine(`"accountId": 0`)).toHaveLength(0);
    });

    test('finds accountIds', () => {
      expect(checkLine(`"accountIds": [ 0 ]`)).toHaveLength(1);
    });

    test('does not find accountIds equal to []', () => {
      expect(checkLine(`"accountIds": []`)).toHaveLength(0);
    });
  });

  describe('createWarningComment', () => {
    test('creates comment', () => {
      const warnings = ['test string | test file | test line'];
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
      expect(await runHelper('PR_url')).toBe('');
      expect(console.error).toHaveBeenCalledTimes(1);
    });

    test('exits if PR url is undefined', async () => {
      expect(await runHelper(undefined, 'token')).toBe('');
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
      expect(output).toBe('### The PR checks have run and found the following warnings:%0A%0A| Warning | Filepath | Line # | %0A| --- | --- | --- | %0A| \"permissions\" field should not be used | dashboards/cool-dash/cool-dash.json | 2 |%0A%0AReference the [Contributing Docs for Dashboards](https://github.com/newrelic/newrelic-quickstarts/blob/main/CONTRIBUTING.md#dashboards) for more information. %0A');
      expect(fetch).toHaveBeenCalledWith(
        'raw-url/dashboards/cool-dash/cool-dash.json',
        { headers: { authorization: 'token token' } }
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
      expect(output).toBe('');
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
      expect(output).toBe('');
      expect(console.error).toHaveBeenCalledWith(
        'Error:',
        '404 - raw-url/dashboards/cool-dash/cool-dash.json'
      );
    });
  });
});
