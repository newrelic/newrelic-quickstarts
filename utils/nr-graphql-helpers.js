'use strict';
const fetch = require('node-fetch');
const { removeRepoPathPrefix } = require('./helpers');

/**
 * Build body param for NR GraphQL request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @returns {String} returns the body for the request as string
 */
const buildRequestBody = ({ queryString, variables }) =>
  JSON.stringify({
    ...(queryString && { query: queryString }),
    ...(variables && { variables }),
  });

/**
 * Send NR GraphQL request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @param {String} url - request URL
 * @param {String} token - API token for request
 * @returns {Object} An object with the results or errors of a GraphQL request
 */
const fetchNRGraphqlResults = async (queryBody, url, token) => {
  let results;
  let graphqlErrors = [];

  try {
    const body = buildRequestBody(queryBody);

    const res = await fetch(url, {
      method: 'post',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': token,
      },
    });

    if (!res.ok) {
      graphqlErrors.push(
        new Error(`Received status code ${res.status} from the API`)
      );
    }

    results = await res.json();
  } catch (error) {
    graphqlErrors.push(error);
  }

  return { data: results, errors: graphqlErrors };
};

/**
 * Handle errors from GraphQL request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @param {Object[]} errors  - An array of any errors found
 * @param {String} filename  - The path related to the validation error
 * @returns undefined
 */
const translateMutationErrors = (errors, filename) => {
  console.error(
    `ERROR: The following validation errors occurred in ${removeRepoPathPrefix(
      filename
    )}`
  );
  errors.forEach((error) => {
    console.error(`${error.type ? `${error.type}:` : ''} ${error.message}`);
  });
};

module.exports = {
  fetchNRGraphqlResults,
  translateMutationErrors,
};
