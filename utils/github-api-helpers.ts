import fetch from 'node-fetch';
import parseLinkHeader from 'parse-link-header';

const QUICKSTART_CONFIG_REGEXP = new RegExp(
  'quickstarts/.+/config.+(yml|yaml)'
);
const INSTALL_CONFIG_REGEXP = new RegExp('install/.+/install.+(yml|yaml)');
const MOCK_FILES_REGEXP = new RegExp('mock_files/.+');

/**
 * Pulls the next page off of a `Link` header
 * @param {String} linkHeader the `Link` header value
 * @returns {String|Null} the next page of results
 */
export const getNextLink = (linkHeader: string): string | null => {
  const parsedLinkHeader = parseLinkHeader(linkHeader);
  if (parsedLinkHeader && parsedLinkHeader.next) {
    return parsedLinkHeader.next.url || null;
  }
  return null;
};

/**
 * Fetches paginated results from the Github API
 * @param {String} url the API to query
 * @param {String} token a token for the API
 * @returns {Promise<Object[]>} all pages of results
 */
export const fetchPaginatedGHResults = async (
  url: string,
  token: string
): Promise<any[]> => {
  let files: any[] = [];
  let nextPageLink = url;
  try {
    while (nextPageLink) {
      const resp = await fetch(nextPageLink, {
        headers: { authorization: `token ${token}` },
      });
      const responseJson = await resp.json();

      if (!resp.ok) {
        throw new Error(`Github API returned: ${responseJson.message}`);
      }
      nextPageLink = getNextLink(resp.headers.get('Link'));
      files = [...files, ...responseJson];
    }
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }

  return files;
};

/**
 * Filters results from the Github API for config yaml and removes test files
 * @param {Array} files the results from Github API
 * @returns {Array} config files from Github API without test files
 */
export const filterQuickstartConfigFiles = (files: any[]): any[] =>
  files.filter(({ filename }) => QUICKSTART_CONFIG_REGEXP.test(filename));

/**
 * Filters out results from the Github API for changes to test files
 * @param {Array} files the results from Github API
 * @returns {Array} files from Github API excluding test files
 */
export const filterOutTestFiles = (files: any[]): any[] => {
  return files.filter(({ filename }) => !MOCK_FILES_REGEXP.test(filename));
};

/**
 * Filters results from the Github API down to install plan config files
 * @param {Array} files the results from Github API
 * @returns {Array} install plan config files from Github API
 */
export const filterInstallPlans = (files: any[]): any[] => {
  return files.filter(({ filename }) => INSTALL_CONFIG_REGEXP.test(filename));
};
