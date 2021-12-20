'use strict';
const { fetchPaginatedGHResults } = require('./github-api-helpers');

const url = process.argv[2];

Promise.resolve(fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN))
  .then((response) => {
    const uniqueQuickstartFilenames = response
      .filter(({ filename }) => {
        return (
          filename.startsWith('quickstarts/') && filename.endsWith('config.yml')
        );
      })
      .map(({ filename }) => filename);

    process.exit(0);
  })
  .catch(() => {
    throw new Error(
      `Github API returned status ${resp.code} - ${resp.message}`
    );
  });
// path.resolve(basePath, '../quickstarts/**/config.yml');
