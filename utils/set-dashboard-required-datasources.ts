import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import {
  translateNGErrors,
  getPublishedComponentIds,
  GetPublishedComponentIdsResult,
} from './lib/nr-graphql-helpers';
import Quickstart from './lib/Quickstart';
import Dashboard from './lib/Dashboard';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import { passedProcessArguments } from './lib/helpers';

const getQuickstartIds = async (
  ghUrl?: string,
  ghToken?: string
): Promise<{ hasFailed: boolean; results: string[] }> => {
  if (!ghToken) {
    console.error('GITHUB_TOKEN is not defined.');
    return { hasFailed: true, results: [] };
  }

  if (!ghUrl) {
    console.error('Github PR URL is not defined.');
    return { hasFailed: true, results: [] };
  }

  const files = await fetchPaginatedGHResults(ghUrl, ghToken);

  const quickstartIds = filterQuickstartConfigFiles(files)
    .filter(isNotRemoved)
    .map(({ filename }) => new Quickstart(filename).config.id);

  return { hasFailed: false, results: quickstartIds };
};

const getPublishedQuickstartsComponentIds = async (ids: string[]) => {
  const results = await Promise.all(
    ids.map((id) => {
      return getPublishedComponentIds(id);
    })
  );

  const hasFailed = results.some(
    (result) => result.errors && result.errors.length > 0
  );

  return { hasFailed, results };
};

const setDashboardsRequiredDataSources = async (
  dashboardIds: string[],
  dataSourceIds: string[]
) => {
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

const setAllDashboardsRequiredDataSources = async (
  quickstartComponentIdsResults: GetPublishedComponentIdsResult[]
) => {
  const results = await Promise.all(
    quickstartComponentIdsResults.map(
      ({ componentIdsMap: { dashboardIds, dataSourceIds } }) => {
        return setDashboardsRequiredDataSources(dashboardIds, dataSourceIds);
      }
    )
  );

  const hasFailed = results.some((quickstartResults) =>
    quickstartResults.some(
      (result) => result?.errors && result.errors.length > 0
    )
  );

  return { hasFailed, results };
};

const reportJobStatus = (hadFailure: boolean) => {
  recordNerdGraphResponse(
    hadFailure,
    CUSTOM_EVENT.SET_DASHBOARD_REQUIRED_DATASOURCES
  );

  if (hadFailure) {
    process.exit(1);
  }
};

const main = async () => {
  const [ghUrl] = passedProcessArguments();
  const ghToken = process.env.GITHUB_TOKEN;

  const { hasFailed: hasQuickstartIdsFailed, results: quickstartIds } =
    await getQuickstartIds(ghUrl, ghToken);

  if (hasQuickstartIdsFailed) {
    reportJobStatus(hasQuickstartIdsFailed);
  }

  const { hasFailed: hasComponentIdsFailed, results: quickstartsComponentIds } =
    await getPublishedQuickstartsComponentIds(quickstartIds);

  if (hasComponentIdsFailed) {
    reportJobStatus(hasComponentIdsFailed);
  }

  const { hasFailed: hasDashboardsRequiredDataSourcesFailed } =
    await setAllDashboardsRequiredDataSources(quickstartsComponentIds);

  reportJobStatus(hasDashboardsRequiredDataSourcesFailed);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
