const fs = require('fs');
const { fetchNRGraphqlResults } = require('../nr-graphql-helpers');
const { fullSchemaQuery } = require('./constants');
const { renderSchema } = require('graphql-markdown');

/**
 * Print function to pass to renderSchema, writes each line separately to a file
 * @param {String} data - The data to write to the file
 */
const printData = (data) => {
  fs.appendFileSync('../docs/graphql-schema-docs.md', `${data}\n`);
};

/**
 * Filters the data to only include NR1Catalog endpoints
 * @param {Object} data - The data to filter
 * @returns {Object} The filtered data in schema form for graphql-markdown
 */
const filterData = (data) => {
  const {
    data: {
      __schema: { types },
    },
  } = data;
  const endpoints = types.filter(
    (type) =>
      type.name.startsWith('Nr1CatalogQuickstart') ||
      type.name.startsWith('Nr1CatalogInstall')
  );

  // Stringifies the data and replaces the NR internal strings in all descriptions
  const removedInternalData = JSON.parse(
    JSON.stringify(endpoints).replace(
      /(\\n\\n---\\n\*\*NR Internal\*\*)(.*?)(\\n\\n)/g,
      ''
    )
  );

  // Return in a GraphQL schema pattern so that graphql-markdown can render correctly
  return { __schema: { types: removedInternalData } };
};

const main = async () => {
  const { NR_API_URL, NR_API_TOKEN } = process.env;
  if (!NR_API_URL || !NR_API_TOKEN) {
    console.error(
      'Please set the NR_API_URL and NR_API_TOKEN environment variables'
    );
    process.exit(1);
  }

  const result = await fetchNRGraphqlResults({
    queryString: fullSchemaQuery,
  });
  const endpoints = filterData(result);

  // Clear the file before writing to it, as each line is written separately
  fs.writeFileSync('../docs/graphql-schema-docs.md', '');
  renderSchema(endpoints, { printer: printData });
  process.exit(0);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
