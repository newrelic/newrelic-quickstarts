const fs = require('fs');
const { fetchNRGraphqlResults } = require('../nr-graphql-helpers');
const { schemaQueryFragments } = require('./constants');
const TOP_LEVEL_ENDPOINT = 'Nr1CatalogQuickstart';

let allTypes = [];
let allNames = [];
let filteredNames = [];
let allPossibleTypes = [];

/** Don't forget to set NR_API_URL, NR_API_TOKEN environment variables  */

/**
 * Loops through nested json to look for endpoint names 
 * @param {String} name - The name of the field
 * @param {Object} ofType - An object containing the types of a field if applicable
 * @return {String} The name of the endpoint
 */
const recursiveEndpoints = ({ name, ofType }) => {

  // If a field has null name, and has an ofType object, we know that it has a name value(s) that we need to look for
  if (!name && ofType) {
    return recursiveEndpoints(ofType);
  }
  return name;
};

/**
 * Takes an array of fields from an endpoint and parses out field names which we will match to other Endpoints
 * @param {Array[Object]} fields - The fields of an endpoint
 * @return {Array[String]} The names of the fields
 */
const getEndpointNames = (fields) => {
  if (!fields || fields.length === 0) {
    return [];
  }
  try {
    return fields.map((field) => {
      if (field.type) {
        const {
          type: { name, ofType },
        } = field;
        return recursiveEndpoints({ name, ofType });
      }
      const { name, ofType } = field;
      return recursiveEndpoints({ name, ofType });
    });
  } catch (error) {
    console.log({ fields });
  }
};

/**
 * Takes an array of endpoint names and recursively fetches the data of each endpoint 
 * @param {Array[String]} endpoints - A list of endpoint names
 */
const fetchRecursively = async (endpoints) => {
  if (endpoints.length > 0) {
    endpoints.forEach(async (endpoint) => {

      // Builds the query using fragments
      const schemaQuery = `query IntrospectionQuery {
          __type(name: "${endpoint}"){
            ...FullType
          }
        }
        ${schemaQueryFragments}
      `;
      
      const result = await fetchNRGraphqlResults({
        queryString: schemaQuery,
      });

      const {
        data: { __type: type },
      } = result;

      // Collecting all types for reference
      allTypes.push(result);
      const { fields, possibleTypes } = type;
      
      // Fields are the specific attributes that can be queried on an endpoint
      const allEndpointNames = getEndpointNames([
        ...(fields || []),
        ...(possibleTypes || []),
      ]);

      // We only want to add the endpoint name if it starts with Nr1Catalog and doesn't already exist in the array
      const catalogFieldNames = allEndpointNames.filter(
        (name) =>
          name && name.startsWith('Nr1Catalog') && !filteredNames.includes(name)
      );

      // Collecting all Nr1Catalog names for reference
      filteredNames = [...filteredNames, ...catalogFieldNames];

      // Not all endpoints have possibleTypes
      allPossibleTypes = [...allPossibleTypes, ...(possibleTypes || [])];

      return await fetchRecursively(catalogFieldNames);
    });
    return;
  }
  // fs.writeFileSync(
  //   `./example-output.json`,
  //   JSON.stringify({ allTypes, allNames, filteredNames, allPossibleTypes })
  // );
  return;
};
const main = async () => {
  const { NR_API_URL, NR_API_TOKEN } = process.env;
  if (!NR_API_URL || !NR_API_TOKEN) {
    console.error(
      'Please set the NR_API_URL and NR_API_TOKEN environment variables'
    );
    process.exit(1);
  }
  fetchRecursively([TOP_LEVEL_ENDPOINT]);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
