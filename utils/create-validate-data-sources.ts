import * as path from 'path';
import {
  fetchPaginatedGHResults,
  filterDataSources,
} from './github-api-helpers';
import {
  chunk,
  fetchNRGraphqlResults,
  translateMutationErrors,
} from './nr-graphql-helpers';
import {
  passedProcessArguments,
  readYamlFile,
  removeRepoPathPrefix,
} from './helpers';
import {
  DataSourceConfig,
  DataSourceConfigInstall,
  DataSourceConfigInstallDirective,
} from './types/DataSourceConfig';
import {
  DataSourceInstallDirectiveInput,
  DataSourceInstallInput,
  DataSourceMutationVariable,
} from './types/DataSourceMutationVariable';
import { DATA_SOURCE_MUTATION, GITHUB_RAW_BASE_URL } from './constants';
import { NerdGraphResponseWithLocalErrors } from './types/nerdgraph';
import { CUSTOM_EVENT, track } from './newrelic/customEvent';

interface DataSourceMutationResponse {
  dataSource: {
    id: string;
  };
}

interface DataSourceAndFilePath {
  filePath: string;
  contents: DataSourceConfig;
}



/**
 * Validates for an array of data source filenames
 * @param {Array} dataSourceFiles - Array containing data sources file names.
 * @return {Promise.<Boolean>} - Boolean value indicating whether all files were validated
 */
export const createValidateUpdateDataSources = async (
  dataSourceFiles: { variables: DataSourceMutationVariable; filePath: string }[]
): Promise<boolean> => {
  type GraphQLResponse = NerdGraphResponseWithLocalErrors<
    DataSourceMutationResponse
  > & {
    filePath: string;
  };

  const chunkedDataSourceRequests = chunk(dataSourceFiles, 5);

  let graphqlResponses: GraphQLResponse[] = [];
  // using a For Of loop so that it respects the `await`
  for (const reqChunk of chunkedDataSourceRequests) {
    const chunkRes = await Promise.all(
      reqChunk.map(async ({ variables, filePath }) => {
        const { data, errors } = await fetchNRGraphqlResults<
          DataSourceMutationVariable,
          DataSourceMutationResponse
        >({
          queryString: DATA_SOURCE_MUTATION,
          variables,
        });

        return { data, filePath, errors };
      })
    );
    graphqlResponses = [...graphqlResponses, ...chunkRes];
  }

  let hasFailed = false;

  graphqlResponses.forEach(({ errors, filePath }) => {
    if (errors && errors.length > 0) {
      hasFailed = true;
      translateMutationErrors(errors, filePath);
    }
  });

  return hasFailed;
};

/**
 * @param {boolean} hasFailed if the validation or submission has failed
 * @param {boolean} isDryRun - true for validation, false for submission
 */
export const recordCustomNREvent = async (hasFailed: boolean, isDryRun: boolean) => {
  const status = hasFailed ? 'failed' : 'success';
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_DATA_SOURCES
    : CUSTOM_EVENT.UPDATE_DATA_SOURCES;

  await track(event, { status });
};

const main = async () => {
  const [GITHUB_API_URL, isDryRun] = passedProcessArguments();

  const githubToken = process.env.GITHUB_TOKEN;
  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }

  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);

  const dataSourceConfigPaths = filterDataSources(files).map(
    ({ filename }) => filename
  );

  const dataSourceConfigs = readDataSourceFiles(dataSourceConfigPaths);

  const mutationVariablesAndFilePaths = dataSourceConfigs.map((config) => {
    return {
      variables: parseDataSource(config, isDryRun === 'true'),
      filePath: config.filePath,
    };
  });

  const hasFailed = await createValidateUpdateDataSources(
    mutationVariablesAndFilePaths
  );
  await recordCustomNREvent(hasFailed, isDryRun === 'true');

  if (hasFailed) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
