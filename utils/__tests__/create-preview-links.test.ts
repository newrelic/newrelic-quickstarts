'use strict';
const {
  mockGitHubResponseFilenames,
  addFilenameObject,
} = require('./test-utilities');

const ghHelpers = require('../github-api-helpers');

const {
  generatePreviewComment,
  createComment,
  createPreviewLink,
  getQuickstartsFromPRFiles,
} = require('../create-preview-links');

jest.mock('../github-api-helpers');
jest.spyOn(console, 'error').mockImplementation(() => {});
jest.spyOn(console, 'log');

const expectCommentHeading = `### Click the link(s) below to view a preview of your changes on newrelic.com/instant-observability<br/><br/>`;
const previewLink = `https://newrelic.com/instant-observability/preview`;

describe('create-preview-links', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  describe('getQuickstartsFromPRFiles', () => {
    test('returns an array of quickstart local paths', async () => {
      ghHelpers.fetchPaginatedGHResults.mockReturnValueOnce([
        { filename: 'quickstarts/apache/config.yml' },
        { filename: 'quickstarts/nested/test/dashboards/test-dash/dash.json' },
        { filename: 'quickstarts/apache/logo.svg' },
      ]);

      const quickstarts = await getQuickstartsFromPRFiles(
        'testurl',
        'testtoken'
      );
      expect(quickstarts).toHaveLength(2);
      expect(quickstarts).toEqual(['apache', 'nested/test']);
    });
  });

  describe('createPreviewLink', () => {
    test('Generates link based on pull request number and quickstart local path', () => {
      const link = createPreviewLink('40', 'apache');
      expect(link).toEqual(
        'https://newrelic.com/instant-observability/preview?pr=40&quickstart=apache'
      );
    });

    test('Generates link based on pull request number and nested quickstart local path', () => {
      const link = createPreviewLink('40', 'deeply/nested/quickstart');
      expect(link).toEqual(
        'https://newrelic.com/instant-observability/preview?pr=40&quickstart=deeply%2Fnested%2Fquickstart'
      );
    });
  });

  describe('createComment', () => {
    test('creates comment for 1 quickstart', () => {
      const quickstarts = [{ path: 'apache', link: 'testlink' }];
      expect(createComment(quickstarts)).toEqual(
        `${expectCommentHeading}- [apache](testlink)`
      );
    });

    test('creates comment for multiple quickstarts', () => {
      const quickstarts = [
        { path: 'apache', link: 'testlink' },
        { path: 'deeply/nested/quickstart', link: 'testlink2' },
        { path: 'other/quickstart', link: 'testlink3' },
      ];
      expect(createComment(quickstarts)).toEqual(
        `${expectCommentHeading}- [apache](testlink)<br/>- [deeply/nested/quickstart](testlink2)<br/>- [other/quickstart](testlink3)`
      );
    });
  });

  describe('generatePreviewComment', () => {
    test('returns false when token is not provided', async () => {
      const res = await generatePreviewComment('testurl', 'testnumber');
      expect(res).toBe(false);
    });

    test('returns false when prURL is not provided', async () => {
      const res = await generatePreviewComment(
        undefined,
        'testnumber',
        'testtoken'
      );
      expect(res).toBe(false);
    });

    test('returns false when prNumber is not provided', async () => {
      const res = await generatePreviewComment(
        'testurl',
        undefined,
        'testtoken'
      );
      expect(res).toBe(false);
    });

    test('fails when Github API call errors', async () => {
      ghHelpers.fetchPaginatedGHResults.mockRejectedValue(
        new Error('test API down')
      );

      const res = await generatePreviewComment(
        'testurl',
        'testnumber',
        'testtoken'
      );
      expect(res).toBe(false);
    });

    test('does not set Github workflow output when there are no quickstart changes', async () => {
      ghHelpers.fetchPaginatedGHResults.mockReturnValueOnce([
        { filename: 'utils/test-script.js' },
        { filename: 'data-sources/test/config.yml' },
      ]);

      const res = await generatePreviewComment(
        'testurl',
        'testnumber',
        'testtoken'
      );
      expect(res).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        'No quickstarts found, skipping preview'
      );
    });

    test('sets Github workflow output when there are quickstart changes', async () => {
      ghHelpers.fetchPaginatedGHResults.mockReturnValueOnce([
        { filename: 'quickstarts/apache/config.yml' },
        { filename: 'quickstarts/nested/test/dashboards/test-dash/dash.json' },
        { filename: 'quickstarts/apache/logo.svg' },
        { filename: 'utils/test-script.js' },
      ]);

      const expectComment = `${expectCommentHeading}- [apache](${previewLink}?pr=1&quickstart=apache)<br/>- [nested/test](${previewLink}?pr=1&quickstart=nested%2Ftest)`;

      const res = await generatePreviewComment('testurl', '1', 'testtoken');
      expect(res).toBe(true);
      expect(console.log).toHaveBeenCalledWith(
        `::set-output name=comment::${JSON.stringify(expectComment)}`
      );
    });
  });
});
