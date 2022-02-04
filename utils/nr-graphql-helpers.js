'use strict';
const fetch = require('node-fetch');
const instantObservabilityCategories = require('./instant-observability-categories.json');

const NR_API_URL = process.env.NR_API_URL;
const NR_API_TOKEN = process.env.NR_API_TOKEN;

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
 * @returns {Object} An object with the results or errors of a GraphQL request
 */
const fetchNRGraphqlResults = async (queryBody) => {
  let results;
  let graphqlErrors = [];

  try {
    const body = buildRequestBody(queryBody);

    const res = await fetch(NR_API_URL, {
      method: 'POST',
      body,
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': NR_API_TOKEN,
      },
    });

    if (!res.ok) {
      graphqlErrors.push(
        new Error(`Received status code ${res.status} from the API`)
      );
    } else {
      const { data, errors } = await res.json();
      results = data;
      if (errors) {
        graphqlErrors = [...graphqlErrors, ...errors];
      }
    }
  } catch (error) {
    graphqlErrors.push(error);
  }

  return { data: results, errors: graphqlErrors };
};

/**
 * Handle errors from GraphQL request
 * @param {Object[]} errors  - An array of any errors found
 * @param {String} filePath  - The path related to the validation error
 * @param {Object[]}  [installPlanErrors=[]] - Array of install plan errors which are handled differently
 * @returns {void}
 */
const translateMutationErrors = (errors, filePath, installPlanErrors = []) => {
  console.error(
    `\nERROR: The following errors occurred while validating: ${filePath}`
  );
  errors.forEach((error) => {
    if (error.extensions && error.extensions.argumentPath) {
      const errorPrefix = error.extensions.argumentPath.join('/');

      console.error(`- ${errorPrefix}: ${error.message}`);
    } else {
      console.error(`- ${error.message}`);
    }
  });

  if (installPlanErrors.length > 0) {
    console.error(
      `DEBUG: The following are install plan errors that occured while validating: ${filePath} and can be safely ignored.`
    );

    installPlanErrors.forEach((error) => {
      if (error.extensions && error.extensions.argumentPath) {
        const errorPrefix = error.extensions.argumentPath.join('/');

        console.error(`- ${errorPrefix}: ${error.message}`);
      } else {
        console.error(`- ${error.message}`);
      }
    });
  }
};

/**
 * Method which filters out user supplied keywords to only keywords which are valid categoryTerms.
 * @param {String[] | undefined} configKeywords  - An array of keywords specified in a quickstart config.yml
 * @returns {String[] | undefined } An array of quickstart categoryTerms
 *
 * @example
 * // input
 * ['python', 'azure', 'infrastructure', 'banana', 'animal']
 *
 * // return
 * ['azure', 'infrastructure']
 */
const getCategoryTermsFromKeywords = (configKeywords = []) => {
  const allCategoryKeywords = instantObservabilityCategories.flatMap(
    (category) => category.associatedKeywords
  );

  const categoryKeywords = configKeywords.reduce((acc, keyword) => {
    if (allCategoryKeywords.includes(keyword)) {
      acc.push(keyword);
    }
    return acc;
  }, []);

  return categoryKeywords.length > 0 ? categoryKeywords : undefined;
};

/**
 * Breaks an array up into parts, the last part may have less elements
 * @param {Array} array - an array of anything
 * @param {Number} chunkSize - the size of the parts
 * @returns {Array} the array broken out into smaller array chunks
 */
const chunk = (array, chunkSize) => {
  let chunkedArray = [];
  let j = array.length;

  if (chunkSize < 1) {
    return chunkedArray;
  }

  for (let i = 0; i < j; i += chunkSize) {
    chunkedArray = [...chunkedArray, array.slice(i, i + chunkSize)];
  }

  return chunkedArray;
};

module.exports = {
  fetchNRGraphqlResults,
  translateMutationErrors,
  getCategoryTermsFromKeywords,
  chunk,
};
