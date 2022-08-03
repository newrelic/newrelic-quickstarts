import { removeRepoPathPrefix } from './lib/helpers';

import Dashboard from './lib/Dashboard';

/**
 * Returns any dashboards with matching dashboard names
 * @param dashboards - An array of objects containing the path and name of a dashboard
 * @returns - An array of matching values
 */
const findMatchingDashboardNames = (
  dashboards: Array<Dashboard>
): Array<Dashboard> => {
  return dashboards.reduce<Dashboard[]>((acc, { identifier, config }) => {
    const duplicates = dashboards.filter(
      (dashboard) =>
        dashboard.identifier !== identifier &&
        dashboard.config.name === config.name
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const main = () => {
  const allDashboards = Dashboard.getAll();
  const nameMatches = findMatchingDashboardNames(allDashboards);
  console.log(nameMatches);

  if (nameMatches.length > 0) {
    console.error(`ERROR: Found matching quickstart dashboard names`);
    console.error(`Punctuation and white space are removed before comparison`);
    nameMatches.forEach((m) =>
      console.error(`${m.identifier} in ${removeRepoPathPrefix(m.configPath)}`)
    );
    console.error(
      `Please update your quickstart dashboard's name to be unique\n`
    );
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
