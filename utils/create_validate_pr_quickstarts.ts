import {
  QuickstartMutationVariable,
  QuickstartAlertInput,
  QuickstartDashboardInput,
  DashboardScreenshot,
  QuickstartDocumentation,
  QuickstartSupportLevel,
  AlertType,
} from './types/QuickstartMutationVariable';
import {
  QuickstartConfigAlert,
  QuickstartConfigDocumentation,
  QuickstartConfig,
} from './types/QuickstartConfig';
import {
  NerdGraphError,
  NerdGraphResponseWithLocalErrors,
} from './types/nerdgraph';

import * as glob from 'glob';
import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
  GithubAPIPullRequestFile,
} from './github-api-helpers';
import {
  findMainQuickstartConfigFiles,
  readQuickstartFile,
  removeRepoPathPrefix,
  passedProcessArguments,
  buildUniqueQuickstartSet,
  FilePathAndContents,
} from './helpers';
import {
  fetchNRGraphqlResults,
  translateMutationErrors,
  getCategoryTermsFromKeywords,
  chunk,
} from './nr-graphql-helpers';
import { track, CUSTOM_EVENT } from './newrelic/customEvent';
import { GITHUB_REPO_BASE_URL, GITHUB_RAW_BASE_URL } from './constants';

export interface QuickstartMutationResponse {
  quickstart: {
    id: string;
  };
}

const gql = String.raw;

const QUICKSTART_MUTATION = gql`
  # gql
  mutation QuickstartRepoQuickstartMutation(
    $dryRun: Boolean
    $id: ID!
    $quickstartMetadata: Nr1CatalogQuickstartMetadataInput!
  ) {
    nr1CatalogSubmitQuickstart(
      dryRun: $dryRun
      id: $id
      quickstartMetadata: $quickstartMetadata
    ) {
      quickstart {
        id
      }
    }
  }
`;

interface SupportLevelMap {
  [key: string]: QuickstartSupportLevel;
}

const SUPPORT_LEVEL_ENUMS: SupportLevelMap = {
  'New Relic': 'NEW_RELIC',
  Community: 'COMMUNITY',
  Verified: 'VERIFIED',
};

/**
 * Because brand new quickstarts added via a PR do not have an ID until they are assigned one at release,
 * this mock UUID allows for validation to take place knowing a different UUID will be used for the actual release.
 */
const MOCK_UUID = '00000000-0000-0000-0000-000000000000';

/**
 * Looks up corresponding quickstart config files for quickstarts known to have changes in a PR.
 * @param {Set<string>} quickstartDirectories - Set of unique quickstart directories.
 * @return {Array} Collection of config file paths.
 */
export const getQuickstartConfigPaths = (
  quickstartDirectories: Set<string>
): string[] => {
  const allQuickstartConfigPaths = findMainQuickstartConfigFiles();

  return Array.from(quickstartDirectories).reduce<string[]>(
    (acc, quickstartDirectory) => {
      const match = allQuickstartConfigPaths.find((path) =>
        path.includes(`/${quickstartDirectory}/`)
      );
      if (match) {
        acc.push(match);
      }
      return acc;
    },
    []
  );
};

/**
 * Builds input argument for submitQuickstart GraphQL mutation.
 * @param {Object} quickstartConfig - An object containing the path and contents of a quickstart config file.
 * @return {Object} An object that represents a quickstart in the context of a GraphQL mutation.
 */
export const buildMutationVariables = (
  quickstartConfig: FilePathAndContents<QuickstartConfig>
): QuickstartMutationVariable => {
  const {
    authors,
    description,
    title,
    slug,
    documentation,
    icon,
    keywords,
    summary,
    installPlans,
    id,
    level,
  } = quickstartConfig.contents[0] || {};
  const alertConfigPaths = getQuickstartAlertsConfigs(quickstartConfig.path);
  const dashboardConfigPaths = getQuickstartDashboardConfigs(
    quickstartConfig.path
  );

  const dryRun = Boolean(passedProcessArguments()[1] === 'true');

  return {
    id: id ? id : MOCK_UUID,
    dryRun,
    quickstartMetadata: {
      alertConditions:
        alertConfigPaths.length > 0
          ? adaptQuickstartAlertsInput(alertConfigPaths)
          : undefined,
      authors: authors && authors.map((author) => ({ name: author })),
      categoryTerms: getCategoryTermsFromKeywords(keywords),
      description: description && description.trim(),
      displayName: title && title.trim(),
      slug: slug && slug.trim(),
      documentation:
        documentation && adaptQuickstartDocumentationInput(documentation),
      icon:
        icon &&
        `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
          quickstartConfig.path
        )}/${icon}`,
      keywords: keywords,
      sourceUrl: `${GITHUB_REPO_BASE_URL}/${getQuickstartRelativePath(
        quickstartConfig.path
      )}`,
      summary: summary && summary.trim(),
      supportLevel: SUPPORT_LEVEL_ENUMS[level],
      installPlanStepIds: installPlans,
      dashboards:
        dashboardConfigPaths.length > 0
          ? adaptQuickstartDashboardInput(dashboardConfigPaths)
          : undefined,
    },
  };
};

/**
 * Gets the relative path of a quickstart from the root config file path.
 * @param configPath - The file path to the root config file of a quickstart.
 * @return {String} Returns the relative path of a quickstart.
 */
const getQuickstartRelativePath = (configPath: string): string => {
  const splitConfigPath = configPath.split('/');
  splitConfigPath.pop();
  return removeRepoPathPrefix(splitConfigPath.join('/'));
};

/**
 * Gets the file paths of all config files within the `alerts` directory of a quickstart.
 * @param {String} quickstartConfigPath - The file path to the root config file of a quickstart.
 * @return {String[]} A set of file-path strings for the config files within the `alerts` directory of a quickstart.
 */
const getQuickstartAlertsConfigs = (quickstartConfigPath: string): string[] => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/alerts/*.+(yml|yaml)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `alertConditions` field.
 * @param {Array} alertConfigPaths - File paths of config files within an `alerts` directory.
 * @return {Array} An set of objects that represent a quickstart's alert conditions in the context of a GraphQL mutation.
 */
const adaptQuickstartAlertsInput = (
  alertConfigPaths: string[]
): QuickstartAlertInput[] =>
  alertConfigPaths.map((alertConfigPath) => {
    const parsedConfig =
      readQuickstartFile<QuickstartConfigAlert>(alertConfigPath);
    const { description, name, type } = parsedConfig.contents[0];

    return {
      description: description && description.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      sourceUrl: getAssetSourceUrl(alertConfigPath),
      type: type && (type.trim() as AlertType),
    };
  });

/**
 * Gets the file paths of all config files within the `dashboards` directory of a quickstart.
 * @param {String} quickstartConfigPath - The file path to the root config file of a quickstart.
 * @returns {String[]} A set of file-path strings for the config files within the `dashboards` directory of a quickstart.
 */
export const getQuickstartDashboardConfigs = (
  quickstartConfigPath: string
): string[] => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*/*.+(json)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `dashboards` field.
 * @param {Array} dashboardConfigPaths - File paths of config files within a `dashboards` directory.
 * @return {Array} An set of objects that represent a quickstart's dashboards in the context of a GraphQL mutation.
 */
const adaptQuickstartDashboardInput = (
  dashboardConfigPaths: string[]
): QuickstartDashboardInput[] => {
  type QuickstartBaseMetadata = { description: string; name: string };

  return dashboardConfigPaths.map((dashboardConfigPath) => {
    const parsedConfig =
      readQuickstartFile<QuickstartBaseMetadata>(dashboardConfigPath);
    const { description, name } = parsedConfig.contents[0];
    const screenshotPaths =
      getQuickstartDashboardScreenshotPaths(dashboardConfigPath);
    return {
      description: description && description.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(parsedConfig.contents[0]),
      sourceUrl: getAssetSourceUrl(dashboardConfigPath),
      screenshots: screenshotPaths && screenshotPaths.map(getScreenshotUrl),
    };
  });
};

/**
 * Creates the GitHub url of each screenshot within the main directory of a quickstart.
 * @param {String} path - The file path of a screenshot.
 * @return {DashboardScreenshot} Returns an object containing the GitHub url of a screenshot.
 */
const getScreenshotUrl = (path: string): DashboardScreenshot => {
  const screenshotFilename = path.split('/').pop();

  return {
    url: `${GITHUB_RAW_BASE_URL}/${getQuickstartRelativePath(
      path
    )}/${screenshotFilename}`,
  };
};

/**
 * Creates the GitHub url of an asset within the main directory of a quickstart.
 * @param {String} path - The file path of an asset.
 * @return {String} Returns an object containing the GitHub url of an asset.
 */
const getAssetSourceUrl = (path: string): string => {
  const assetFilename = path.split('/').pop();

  return `${GITHUB_REPO_BASE_URL}/${getQuickstartRelativePath(
    path
  )}/${assetFilename}`;
};

/**
 * Creates the file path of each screenshot within the dashboard directory of a quickstart.
 * @param {String} dashboardConfigPath - The file path of the config file within a quickstart's `dashboards` directory.
 * @return {String[]} A set of file-path strings for any screenshots within the same `dashboards` directory.
 */
export const getQuickstartDashboardScreenshotPaths = (
  dashboardConfigPath: String
): string[] => {
  const splitConfigPath = dashboardConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/*.+(jpeg|jpg|png)`;

  return glob.sync(globPattern);
};

/**
 * Builds input arguments for the `documentation` field.
 * @param {QuickstartConfigDocumentation[]} documentation - The documentation sections of a parsed quickstart config.yml file.
 * @return {QuickstartDocumentation[]}  An set of objects that represent a quickstart's documentation in the context of a GraphQL mutation.
 */
const adaptQuickstartDocumentationInput = (
  documentation: QuickstartConfigDocumentation[]
): QuickstartDocumentation[] =>
  documentation.map((doc) => {
    const { name, url, description } = doc;
    return {
      displayName: name,
      url,
      description,
    };
  });

/**
 * Creates GraphQL requests to be used in the SubmitQuickstartMetadata mutation.
 * @param {Array} files - A list of all files changed in the PR.
 * @return {Array} Returns objects containing the file path of a quickstart's root config file and the variables used in the submitQuickstart mutation.
 */
export const getGraphqlRequests = (
  files: { filename: string }[]
): { filePath: string; variables: QuickstartMutationVariable }[] => {
  const uniqueQuickstarts = files.reduce(
    buildUniqueQuickstartSet,
    new Set<string>()
  );
  const quickstartConfigPaths = getQuickstartConfigPaths(uniqueQuickstarts);

  return quickstartConfigPaths.map((configPath) => ({
    filePath: removeRepoPathPrefix(configPath),
    variables: buildMutationVariables(readQuickstartFile(configPath)),
  }));
};

type GraphQLResponse =
  NerdGraphResponseWithLocalErrors<QuickstartMutationResponse> & {
    filePath: string;
  };

/**
 * Builds and sends GraphQL mutations to validate the quickstarts in a PR and prints out any errors
 * @param {Array} files - A list of all files changed in the PR.
 * @return {Promise.<Boolean>} A value indicating if the GitHub Action should fail
 */
const createValidateUpdateQuickstarts = async (
  files: GithubAPIPullRequestFile[]
): Promise<boolean> => {
  const graphqlRequests = getGraphqlRequests(filterOutTestFiles(files));
  const chunkedRequests = chunk(graphqlRequests, 5); // Run requests in groups of 5

  let graphqlResponses: GraphQLResponse[] = [];
  // using a For Of loop so that it respects the `await`
  for (const reqChunk of chunkedRequests) {
    const chunkRes = await Promise.all(
      reqChunk.map(async ({ variables, filePath }) => {
        const { data, errors } = await fetchNRGraphqlResults<
          QuickstartMutationVariable,
          QuickstartMutationResponse
        >({
          queryString: QUICKSTART_MUTATION,
          variables,
        });

        return { data, errors, filePath };
      })
    );
    graphqlResponses = [...graphqlResponses, ...chunkRes];
  }
  return Boolean(countErrors(graphqlResponses));
};

/**
 * @param {Object[]} graphqlResponses[]
 * @param {Object[]} graphqlResponses[].errors
 * @param {string[]} graphqlResponses[].filePath
 * @returns {number}
 */
export const countErrors = (graphqlResponses: GraphQLResponse[]): number => {
  let errorCount = 0;

  graphqlResponses.forEach(({ errors, filePath }) => {
    // filter out errors where install plan id does not exist
    const installPlanErrorExists = (error: Error | NerdGraphError) =>
      'extensions' in error &&
      error?.extensions?.argumentPath?.includes('installPlanStepIds') &&
      error?.message?.includes(
        'contains an install plan step that does not exist'
      );

    const installPlanErrors =
      (errors?.filter(installPlanErrorExists) as NerdGraphError[]) ?? [];
    const remainingErrors =
      errors?.filter((error) => !installPlanErrorExists(error)) ?? [];

    errorCount += remainingErrors.length;

    if (errors && errors.length > 0) {
      translateMutationErrors(remainingErrors, filePath, installPlanErrors);
    }
  });

  return errorCount;
};

/**
 * @param {boolean} hasFailed if the validation or submission has failed
 * @param {boolean} isDryRun - true for validation, false for submission
 */
const recordCustomNREvent = async (hasFailed: boolean, isDryRun: boolean) => {
  const status = hasFailed ? 'failed' : 'success';
  const event = isDryRun
    ? CUSTOM_EVENT.VALIDATE_QUICKSTARTS
    : CUSTOM_EVENT.UPDATE_QUICKSTARTS;

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

  const hasFailed = await createValidateUpdateQuickstarts(files);
  await recordCustomNREvent(hasFailed, isDryRun === 'true');

  if (hasFailed) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
