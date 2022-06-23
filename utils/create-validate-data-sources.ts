import * as path from 'path';

import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
} from './lib/github-api-helpers';
import { chunk, translateMutationErrors } from './lib/nr-graphql-helpers';
import { passedProcessArguments, prop } from './lib/helpers';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import DataSource from './lib/DataSource';

const DATA_SOURCE_CONFIG_REGEXP = new RegExp(
  'data-sources/.+/config.+(yml|yaml)'
);

const main = async () => {
  const [GITHUB_API_URL, dryRun] = passedProcessArguments();
  const githubToken = process.env.GITHUB_TOKEN;
  const isDryRun = dryRun === 'true';

  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);

  const dataSources = filterOutTestFiles(files)
    .map(prop('filename'))
    .filter((filename) => DATA_SOURCE_CONFIG_REGEXP.test(filename))
    .map((filename) => path.dirname(filename).replace('data-sources/', ''))
    .map((filename) => new DataSource(filename));

  // Submit all of the mutations (in chunks of 5)
  const results = await Promise.all(
    chunk(dataSources, 5).flatMap((chunk) =>
      chunk.map((source) => source.submitMutation(isDryRun))
    )
  );

  const failures = results.filter((r) => r.errors && r.errors.length);

  failures.forEach(({ errors, name }) =>
    translateMutationErrors(errors!, name)
  );

  const hasFailed = failures.length > 0;
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_DATA_SOURCES
    : CUSTOM_EVENT.UPDATE_DATA_SOURCES;

  await recordNerdGraphResponse(hasFailed, event);

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

export default main;
