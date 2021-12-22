'use strict';

const fetch = require('node-fetch');

const buildRequestBody = ({ queryString, variables }) =>
  JSON.stringify({
    ...(queryString && { query: queryString }),
    ...(variables && { variables }),
  });

const fetchNRGraphqlResults = async (queryBody, url, token) => {
  try {
    const body = buildRequestBody(queryBody);
    console.log(body);

    const res = await fetch(url, {
      method: 'post',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': token,
      },
    });

    if (!res.ok) {
      throw new Error(`Received status code ${res.status} from the API`);
    }

    const results = await res.json();

    if (results.errors) {
      console.error(JSON.stringify(results.errors, null, 2));
    }

    return results;
  } catch (error) {
    console.error('Encountered a problem querying the graphql api', error);
  }
};

module.exports = {
  fetchNRGraphqlResults,
};
