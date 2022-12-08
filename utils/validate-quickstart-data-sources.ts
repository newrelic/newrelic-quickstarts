import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  GithubAPIPullRequestFile,
  isNotRemoved,
} from './lib/github-api-helpers';

import { getCoreDataSourceIds } from './lib/nr-graphql-helpers';

import Quickstart from './lib/Quickstart';
import DataSource from './lib/DataSource';
import { passedProcessArguments } from './lib/helpers';

export const validateDataSourceIds = (
  githubFiles: GithubAPIPullRequestFile[],
  coreDataSourceIds: string[]
) => {
  const quickstartsWithInvalidDataSources = filterQuickstartConfigFiles(
    githubFiles
  )
    .filter(isNotRemoved)
    .map(({ filename }) => new Quickstart(filename))
    .map((quickstart) => {
      const invalidIds =
        quickstart.config.dataSourceIds?.filter((dataSourceId) => {
          // dataSourceId does not exist and is not a core data source
          return (
            !new DataSource(dataSourceId).isValid &&
            !coreDataSourceIds.includes(dataSourceId)
          );
        }) ?? [];
      return {
        quickstart,
        invalidDataSourceIds: invalidIds,
      };
    })
    .filter((q) => q.invalidDataSourceIds.length > 0);

  if (quickstartsWithInvalidDataSources.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding data source id.\n`
    );
    console.error(`An install plan id must match an existing data source id.`);
    quickstartsWithInvalidDataSources.forEach((m) =>
      console.error(
        `- ${m.invalidDataSourceIds.join(', ')} in ${m.quickstart.configPath}`
      )
    );
    console.error(
      `\nPlease change to an existing install plan id or remove the ids.`
    );

    if (require.main === module) {
      process.exit(1);
    }
  }
};

const main = async () => {
  const [GITHUB_API_URL ] = passedProcessArguments();
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken)
  const coreDataSourceIds = await getCoreDataSourceIds();

  validateDataSourceIds(filterOutTestFiles(files), coreDataSourceIds);
}

if (require.main === module) {
  main();
}
