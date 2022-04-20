import * as path from 'path';
import {
  fetchPaginatedGHResults,
  filterDataSources,
} from './github-api-helpers';
import { passedProcessArguments, readYamlFile } from './helpers';
import { DataSourceConfig } from './types/DataSourceConfig';

const gql = String.raw;
const DATA_SOURCE_MUTATION = gql`
  mutation QuickstartRepoDataSourceMutation(
    $dryRun: Boolean
    $id: ID!
    $dataSourceMetadata: Nr1CatalogDataSourceMetadataInput!
  ) {
    nr1CatalogSubmitDataSource(
      dryRun: $dryRun
      id: $id
      dataSourceMetadata: $dataSourceMetadata
    ) {
      dataSource {
        id
      }
    }
  }
`;

interface DataSourceMutationResponse {
  dataSource: {
    id: string;
  };
}

interface DataSourceAndFilePath {
  filePath: string;
  contents: DataSourceConfig;
}

export const readDataSourceFile = (filePath: string): DataSourceAndFilePath => {
  const fullFilePath = path.join(process.cwd(), `../${filePath}`);
  const dataSourceConfig = readYamlFile<DataSourceConfig>(fullFilePath);

  return {
    filePath: dataSourceConfig.path,
    contents: dataSourceConfig.contents[0],
  };
};

export const readDataSourceFiles = (
  filePaths: string[]
): DataSourceAndFilePath[] => filePaths.map(readDataSourceFile);

// 1. fetch github files for pull request
// 2. filter files to data source only
// 3. read the data source files
// 4. transform data source to mutation variable
// 5. submit to nerdgraph
// 6. if error, output error message
//
//
// Questions:
// account_required field should be moved out of nerdlet_state
// account_required and nerdlet_state should be camel case
// should icon be referenced directly in the config.yml

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
};
