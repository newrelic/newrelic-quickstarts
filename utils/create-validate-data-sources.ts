import * as path from 'path';
import {
  fetchPaginatedGHResults,
  filterDataSources,
} from './github-api-helpers';
import { chunk, fetchNRGraphqlResults, translateMutationErrors } from './nr-graphql-helpers';
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
import { GITHUB_RAW_BASE_URL } from './constants';
import { createValidateUpdateInstallPlan } from './create-validate-install-plans';
import { NerdGraphResponseWithLocalErrors } from './types/nerdgraph';
import { CUSTOM_EVENT, track } from './newrelic/customEvent';

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

/**
 * Reads a single data source config file
 * @param filePath - the path to a data source config.yml
 * @returns an object containing the contents of the file and the file path
 */
export const readDataSourceFile = (filePath: string): DataSourceAndFilePath => {
  const fullFilePath = path.join(process.cwd(), `../${filePath}`);
  const dataSourceConfig = readYamlFile<DataSourceConfig>(fullFilePath);

  return {
    filePath: dataSourceConfig.path,
    contents: dataSourceConfig.contents[0],
  };
};

/**
 * Reads multiple data source config files
 * @param filePaths - an array of data source config.yml file paths
 * @returns an array containing objects with the contents of each file and its file path
 */
export const readDataSourceFiles = (
  filePaths: string[]
): DataSourceAndFilePath[] => filePaths.map(readDataSourceFile);

/**
 * Parses a data source install directive
 * @param directive - the install directive from the config.yml
 * @returns a parsed install directive for submission to Nerdgraph
 */
export const parseInstallDirective = (
  directive: DataSourceConfigInstallDirective
): DataSourceInstallDirectiveInput => {
  if ('link' in directive) {
    const link = directive.link;
    return {
      link: {
        url: link.url?.trim() ?? '',
      },
    };
  } else if ('nerdlet' in directive) {
    const nerdlet = directive.nerdlet;
    return {
      nerdlet: {
        nerdletId: nerdlet?.nerdletId.trim() ?? '',
        nerdletState:
          nerdlet.nerdletState && JSON.stringify(nerdlet.nerdletState),
        requiresAccount: nerdlet.requiresAccount,
      },
    };
  } else {
    return directive;
  }
};

/**
 * Parses a data source install field
 * @param install - the `install` field of a data source config.yml
 * @returns a parsed `install` field for submission to Nerdgraph
 */
export const parseInstall = (
  install: DataSourceConfigInstall
): DataSourceInstallInput => {
  return {
    primary: parseInstallDirective(install.primary),
    fallback: install.fallback && parseInstallDirective(install.fallback),
  };
};

/**
 * Generates the asset URL for an icon
 * @param iconName - the name of the file
 * @param configPath - the path to the data source
 * @returns a github raw url to the file
 */
export const getIconUrl = (iconName: string, configPath: string): string => {
  const dirName = path.dirname(configPath);
  const relDirName = removeRepoPathPrefix(dirName);
  return `${GITHUB_RAW_BASE_URL}/${relDirName}/${iconName}`;
};

/**
 * Parses a data source
 * @param dataSource - a data source plus its file path
 * @param [dryRun=true] - true if we are just checking validation, false for submission
 * @returns the mutation variable to send to Nerdgraph
 */
export const parseDataSource = (
  dataSource: DataSourceAndFilePath,
  dryRun: boolean = true
): DataSourceMutationVariable => {
  const {
    id,
    displayName,
    install,
    categoryTerms,
    keywords,
    description,
    icon,
  } = dataSource.contents;
  return {
    id: id.trim(),
    dryRun,
    dataSourceMetadata: {
      displayName: displayName.trim(),
      icon: getIconUrl(icon, dataSource.filePath),
      install: parseInstall(install),
      categoryTerms: categoryTerms && categoryTerms.map((t) => t.trim()),
      keywords: keywords && keywords.map((k) => k.trim()),
      description: description && description.trim(),
    },
  };
};

/**
 * Validates for an array of data source filenames
 * @param {Array} dataSourceFiles - Array containing data sources file names.
 * @return {Promise.<Boolean>} - Boolean value indicating whether all files were validated
 */
const createValidateUpdateDataSources = async (
  dataSourceFiles: { variables: DataSourceMutationVariable, filePath: string }[]
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
const recordCustomNREvent = async (hasFailed: boolean, isDryRun: boolean) => {
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
    }
  })

  const hasFailed = await createValidateUpdateDataSources(mutationVariablesAndFilePaths);
  await recordCustomNREvent(hasFailed, isDryRun === 'true');

  if (hasFailed) {
    process.exit(1);
  }
}

if (require.main === module) {
  main();
}
