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
      expect(console.log.mock.lastCall[0]).toContain(
        '::set-output name=comment::'
      );
      //if we get errors from fetchPaginatedHGresults, fetch
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
