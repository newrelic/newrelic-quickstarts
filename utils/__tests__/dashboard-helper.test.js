'use strict';
import {
  checkLine,
  createWarningComment,
  runHelper,
  getLines,
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

const testJson = {
  "name": "Azure Disk Storage",
  "description": null,
  "pages": [
    {
      "name": "Azure Disk Storage",
      "description": null,
      "widgets": [
        {
          "title": "Summary",
          "layout": {
            "column": 1,
            "row": 1,
            "width": 8,
            "height": 2
          },
          "linkedEntityGuids": null,
          "visualization": {
            "id": "viz.billboard"
          },
          "rawConfiguration": {
            "facet": {
              "showOtherSeries": false
            },
            "nrqlQueries": [
              {
                "accountIds": [
                  31415
                ],
                "query": " FROM Metric SELECT average(azure.compute.disks.CompositeDiskReadBytes.sec) AS 'Average Composite Disk Read Bytes', average(azure.compute.disks.CompositeDiskReadOperations.sec) AS 'Average Composite Disk Read Operations', average(azure.compute.disks.CompositeDiskWriteBytes.sec) AS 'Average Composite Disk Write Bytes', average(azure.compute.disks.CompositeDiskWriteOperations.sec) AS 'Average Composite Disk Write Operations', average(azure.compute.disks.DiskPaidBurstIOPS) AS 'Average Disk Paid Burst IOPS' WHERE collector.name = 'azure-monitor' and azure.resourceType = 'microsoft.compute/disks' "
              }
            ],
            "platformOptions": {
              "ignoreTimeRange": false
            }
          }
        },
      ]
    }
  ],
  "variables": []
}

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
      expect(checkLine(`"accountIds": [  31415  ]`)).toHaveLength(1);
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

  describe('getLines', () => {
    test('finds accountIds across multiple lines', () => {
      // const multiLine = {"accountIds": [ 12345678 ]}
      console.debug('Got here');
      const lines = getLines(testJson);
      console.debug("lines: ", lines);
      const warnings = [];
      for (const line of lines) {
        console.debug(line);
        warnings.push(...checkLine(line));
      }
      expect(warnings).toHaveLength(1);
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
        '### The PR checks have run and found the following warnings:\n\n| Warning | Filepath | Line # | \n| --- | --- | --- | \n| "permissions" field should not be used | dashboards/cool-dash/cool-dash.json | 2 |\n\nReference the [Contributing Docs for Dashboards](https://github.com/newrelic/newrelic-quickstarts/blob/main/CONTRIBUTING.md#dashboards) for more information. \n'
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
