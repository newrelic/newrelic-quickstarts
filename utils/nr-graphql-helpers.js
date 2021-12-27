'use strict';

const fetch = require('node-fetch');

const NR_API_TOKEN = process.env.NR_API_TOKEN;
const NR_API_URL = process.env.NR_API_URL;

/**
 * Build body param for NR Graphql request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @returns {String} returns the body for the request as string
 */
const buildRequestBody = ({ queryString, variables }) =>
  JSON.stringify({
    ...(queryString && { query: queryString }),
    ...(variables && { variables }),
  });

/**
 * Send NR Graphql request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @param {String} url - request URL
 * @returns {Promise<Object[]} returns the resulting array
 */
const fetchNRGraphqlResults = async (queryBody) => {
  try {
    const body = buildRequestBody(queryBody);

    const res = await fetch(NR_API_URL, {
      method: 'post',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': NR_API_TOKEN,
      },
    });

    if (!res.ok) {
      console.error(`Received status code ${res.status} from the API`);
    }

    const results = await res.json();

    return results;
  } catch (error) {
    console.error('Encountered a problem querying the graphql api', error);
  }
};

/**
 * Send NR Graphql Request
 * @param {{queryString, variables}} queryBody - query string and corresponding variables for request
 * @returns {String} returns the body for the request as string
 */
const translateMutationErrors = (errors, filename) => {
  console.error(`ERROR: the following validation errors in ${filename}`);
  errors.forEach(
    ({
      message,
      extensions: {
        argumentPath,
        nerdGraphExtensions: { errorCode },
      },
    }) => {
      if (errorCode === 'VALIDATION_ERROR') {
        console.error(`for field ${argumentPath}: ${message}`);
      } else {
        console.error(`${errorCode}: ${message}`);
      }
    }
  );
};

module.exports = {
  fetchNRGraphqlResults,
  translateMutationErrors,
};
