'use strict';

const fetch = require('node-fetch');
const parseLinkHeader = require('parse-link-header');

const QUICKSTART_CONFIG_REGEXP = new RegExp(
  'quickstarts/.+/config.+(yml|yaml|json)'
);
const INSTALL_CONFIG_REGEXP = new RegExp('install/.+/install.+(yml|yaml|json)');
const MOCK_QUICKSTART_REGEXP = new RegExp('mock_quickstarts/.+');

/**
 * Pulls the next page off of a `Link` header
 * @param {String} linkHeader the `Link` header value
 * @returns {String|Null} the next page of results
 */
const getNextLink = (linkHeader) => {
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
const fetchPaginatedGHResults = async (url, token) => {
  let files = [];
  let nextPageLink = url;
  while (nextPageLink) {
    const resp = await fetch(nextPageLink, {
      headers: { authorization: `token ${token}` },
    });
    if (!resp.ok) {
      console.error(
        `ERROR: Github API returned status ${resp.code} - ${resp.message}`
      );
      process.exit(1);
    }
    const page = await resp.json();
    nextPageLink = getNextLink(resp.headers.get('Link'));
    files = [...files, ...page];
  }
  return files;
};

/**
 * Filters results from the Github API for config yaml and removes test files
 * @param {Array} files the results from Github API
 * @returns {Array} config files from Github API without test files
 */
const filterQuickstartConfigFiles = (files) =>
  files.filter(({ filename }) => QUICKSTART_CONFIG_REGEXP.test(filename));

/**
 * Filters out results from the Github API for changes to test files
 * @param {Array} files the results from Github API
 * @returns {Array} files from Github API excluding test files
 */
const filterOutTestFiles = (files) => {
  return files.filter(({ filename }) => !MOCK_QUICKSTART_REGEXP.test(filename));
};

/**
 * Filters out results from the Github API for changes to test files
 * @param {Array} files the results from Github API
 * @returns {Array} install plan config files from Github API
 */
const filterInstallPlans = (files) => {
  return files.filter(({ filename }) => INSTALL_CONFIG_REGEXP.test(filename));
};

module.exports = {
  fetchPaginatedGHResults,
  getNextLink,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  filterInstallPlans,
};
