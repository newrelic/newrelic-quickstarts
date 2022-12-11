import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import { chunk, translateMutationErrors } from './lib/nr-graphql-helpers';
import { passedProcessArguments, prop } from './lib/helpers';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import DataSource, { DataSourceMutationResponse } from './lib/DataSource';
import { NerdGraphResponseWithLocalErrors } from './types/nerdgraph';

import type { DataSourceConfig } from './types/DataSourceConfig';

const DATA_SOURCE_CONFIG_REGEXP = new RegExp(
  'data-sources/.+/config.+(yml|yaml)'
);

export const getDataSourceId = (filename: string) => {
  const filePath = path.resolve(__dirname, '..', filename);
  if (!fs.existsSync(filePath)) {
    return '';
  }

  const config = yaml.load(
    fs.readFileSync(filePath).toString('utf-8')
  ) as DataSourceConfig;

  return config.id;
};

/**
 * Entrypoint.
 */
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
    .filter(isNotRemoved)
    .map(prop('filename'))
    .filter((filename) => DATA_SOURCE_CONFIG_REGEXP.test(filename))
    .map((filename) => getDataSourceId(filename))
    .filter(Boolean)
    .map((filename) => new DataSource(filename));

  const results: (NerdGraphResponseWithLocalErrors<DataSourceMutationResponse> & {
    name: string;
  })[] = [];
  // Submit all of the mutations (in chunks of 5)
  for (const c of chunk(dataSources, 5)) {
    const res = await Promise.all(
      c.map((source) => source.submitMutation(isDryRun))
    );

    results.concat(res);
  }

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
