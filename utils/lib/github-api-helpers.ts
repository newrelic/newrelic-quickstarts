import fetch from 'node-fetch';
import * as parseLinkHeader from 'parse-link-header';
import {
  QUICKSTART_CONFIG_REGEXP,
  DATA_SOURCE_CONFIG_REGEXP,
} from '../constants';
import logger from '../logger';
const INSTALL_CONFIG_REGEXP = new RegExp('install/.+/install.+(yml|yaml)');
const MOCK_FILES_REGEXP = new RegExp('mock_files/.+');
const TEMPLATE_REGEXP = new RegExp('_template/.+');

/**
 * Pulls the next page off of a `Link` header
 * @param {String|Null} linkHeader the `Link` header value
 * @returns {String|Null} the next page of results
 */
export const getNextLink = (linkHeader: string | null): string | null => {
  const parsedLinkHeader = parseLinkHeader(linkHeader);
  if (parsedLinkHeader && parsedLinkHeader.next) {
    return parsedLinkHeader.next.url || null;
  }
  return null;
};

export interface GithubAPIPullRequestFile {
  sha: string;
  filename: string;
  status:
    | 'added'
    | 'removed'
    | 'modified'
    | 'renamed'
    | 'copied'
    | 'changed'
    | 'unchanged';
  additions: number;
  deletions: number;
  changes: number;
  blob_url: string;
  raw_url: string;
  contents_url: string;
  path: string;
}

/**
 * Fetches paginated results from the Github API
 * @param {String} url the API to query
 * @param {String} token a token for the API
 * @returns {Promise<Object[]>} all pages of results
 */
export const fetchPaginatedGHResults = async (
  url: string,
  token: string
): Promise<GithubAPIPullRequestFile[]> => {
  logger.debug(`Running fetch against ${url}`, { url });
  let files: GithubAPIPullRequestFile[] = [];
  let nextPageLink: string | null = url;
  try {
    while (nextPageLink) {
      logger.debug(`Fetching ${nextPageLink}`, { url: nextPageLink });
      const resp = await fetch(nextPageLink, {
        headers: { authorization: `token ${token}` },
      });
      // TODO: this should happen after the resp.ok check
      const responseJson = await resp.json();

      if (!resp.ok) {
        logger.error(`Error from Github API`, {
          url: nextPageLink,
          status: resp.statusText,
          code: resp.status,
        });
        throw new Error(`Github API returned: ${responseJson.message}`);
      }
      nextPageLink = getNextLink(resp.headers.get('Link'));
      files = [...files, ...responseJson];
    }
  } catch (error) {
    logger.error('Error:', { error });
    process.exit(1);
  }

  return files;
};

/**
 * Filters results from the Github API for config yaml in `quickstarts/`
 * @param {Array} files the results from Github API
 * @returns {Array} config files from Github API without test files
 */
export const filterQuickstartConfigFiles = (
  files: GithubAPIPullRequestFile[]
): GithubAPIPullRequestFile[] =>
  files.filter(({ filename }) => QUICKSTART_CONFIG_REGEXP.test(filename));

/**
 * Filters out results from the Github API for changes to test files
 * @param {Array} files the results from Github API
 * @returns {Array} files from Github API excluding test files
 */
export const filterOutTestFiles = (
  files: GithubAPIPullRequestFile[]
): GithubAPIPullRequestFile[] => {
  return files.filter(
    ({ filename }) =>
      !MOCK_FILES_REGEXP.test(filename) && !TEMPLATE_REGEXP.test(filename)
  );
};

/**
 * Filters results from the Github API down to install plan config files
 * @param {Array} files the results from Github API
 * @returns {Array} install plan config files from Github API
 */
export const filterInstallPlans = (
  files: GithubAPIPullRequestFile[]
): GithubAPIPullRequestFile[] => {
  return files.filter(({ filename }) => INSTALL_CONFIG_REGEXP.test(filename));
};

/**
 * Filters results from the Github API down to data source config files
 * @param files the results from Github API
 * @returns data source config files from Github API
 */
export const filterDataSources = (
  files: GithubAPIPullRequestFile[]
): GithubAPIPullRequestFile[] => {
  return files.filter(({ filename }) =>
    DATA_SOURCE_CONFIG_REGEXP.test(filename)
  );
};

/**
 * Returns whether a file exists or was removed during a pull request
 * @param file the results from Github API
 * @returns a boolean indicating whether the file exists
 */
export const isNotRemoved = (file: GithubAPIPullRequestFile): boolean =>
  file.status !== 'removed';
