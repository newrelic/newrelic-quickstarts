import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import {
  translateNGErrors,
  getPublishedComponentIds,
} from './lib/nr-graphql-helpers';
import Quickstart, {
  QuickstartMutationResponse,
  QuickstartComponentTypename,
} from './lib/Quickstart';
import Dashboard from './lib/Dashboard';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import { passedProcessArguments } from './lib/helpers';

const getQuickstartIds = async (ghUrl?: string, ghToken?: string) => {
  if (!ghToken) {
    console.error('GITHUB_TOKEN is not defined.');
    return { hasFailed: false, results: [] };
  }

  if (!ghUrl) {
    console.error('Github PR URL is not defined.');
    return { hasFailed: false, results: [] };
  }

  const files = await fetchPaginatedGHResults(ghUrl, ghToken);

  return filterQuickstartConfigFiles(files)
    .filter(isNotRemoved)
    .map(({ filename }) => new Quickstart(filename).config.id);
};

const getPublishedQuickstarts = async (ids: string[]) => {
  return Promise.all(
    ids.map((id) => {
      return getPublishedComponentIds(id);
    })
  );
};

const setDashboardsRequiredDataSources = async (
  quickstart: QuickstartMutationResponse['quickstart'] // Refactor to component ids map
) => {
  const dashboardIds = quickstart.metadata.quickstartComponents.reduce(
    (acc: string[], component) => {
      if (component.__typename === QuickstartComponentTypename.Dashboard) {
        return [...acc, component.id];
      }

      return acc;
    },
    []
  );

  const dataSourceIds = quickstart.dataSources.map(({ id }) => id);

  const results = await Promise.all(
    dashboardIds.map(async (dashboardId) => {
      const result = await Dashboard.submitSetRequiredDataSourcesMutation(
        dashboardId,
        dataSourceIds
      );

      if (result.errors) {
        console.error(
          `Failed to associate dashboard with id ${dashboardId} to ${JSON.stringify(
            dataSourceIds
          )}`
        );
        translateNGErrors(result.errors);
      }

      return result;
    })
  );

  return results;
};

const main = async () => {
  const [ghUrl] = passedProcessArguments();
  const ghToken = process.env.GITHUB_TOKEN;

  const quickstartIds = await getQuickstartIds(ghUrl, ghToken);

  const publishedQuickstarts = await getPublishedQuickstarts(quickstartIds);

  const setDashboardRequiredDataSourcesResults = await Promise.all(
    publishedQuickstarts.map((quickstart) => {
      return setDashboardsRequiredDataSources(quickstart);
    })
  );

  const hadDashboardRequiredDataSourcesError =
    setDashboardRequiredDataSourcesResults.some((dashboardsResults) => {
      return dashboardsResults.some(
        (result) => result?.errors && result.errors.length > 0
      );
    });

  recordNerdGraphResponse(
    hadDashboardRequiredDataSourcesError,
    CUSTOM_EVENT.SET_DASHBOARD_REQUIRED_DATASOURCES
  );

  if (hadDashboardRequiredDataSourcesError) {
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
