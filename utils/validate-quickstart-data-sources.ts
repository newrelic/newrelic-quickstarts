import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  GithubAPIPullRequestFile,
  isNotRemoved,
} from './lib/github-api-helpers';

import { getPublishedDataSourceIds } from './lib/nr-graphql-helpers';

import Quickstart from './lib/Quickstart';
import DataSource from './lib/DataSource';
import { passedProcessArguments } from './lib/helpers';

export const validateDataSourceIds = async (
  githubFiles: GithubAPIPullRequestFile[]
) => {
  const { coreDataSourceIds, errors } = await getPublishedDataSourceIds();

  if (errors && errors.length) {
    console.error('Error fetching published data sources')
    errors.forEach(error => {
      console.error(error.message)
    })
    if (require.main === module) {
      process.exit(1);
    }
    return
  }


  const quickstartsWithInvalidDataSources = filterQuickstartConfigFiles(
    githubFiles
  )
    // filter out removed files
    .filter(isNotRemoved)
    // map all filenames to quickstarts
    .map(({ filename }) => new Quickstart(filename))
    // map each quickstart that has an invalid data source id
    .map((quickstart) => {
      const invalidIds =
        quickstart.config.dataSourceIds?.filter((dataSourceId) => {
          // dataSourceId does not exist and is not a core data source
          return (
            !coreDataSourceIds.includes(dataSourceId) &&
            !new DataSource(dataSourceId).isValid
          );
        }) ?? [];
      return {
        quickstart,
        invalidDataSourceIds: invalidIds,
      };
    })
    // filter out empty values
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

  await validateDataSourceIds(filterOutTestFiles(files));
}

if (require.main === module) {
  main();
}
