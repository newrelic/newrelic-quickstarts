'use strict';
const fetch = require('node-fetch');

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
 * @returns {Promise<Object[]} returns the resulting array
 */
const fetchNRGraphqlResults = async (queryBody, url, token) => {
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
      console.error(`Received status code ${res.status} from the API`);
    }

    const results = await res.json();

    return results;
  } catch (error) {
    console.error('Encountered a problem querying the GraphQL API', error);
  }
};

/**
 * Send NR GraphQL Request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @returns {String} returns the body for the request as string
 */
const translateMutationErrors = (errors, filename) => {
  console.error(`ERROR: the following validation errors in ${filename}`);
  errors.forEach(({ type, message }) => {
    console.error(`${type}: ${message}`);
  });
};

module.exports = {
  fetchNRGraphqlResults,
  translateMutationErrors,
};
