'use strict';
const glob = require('glob');
const path = require('path');
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  getMatchingNames,
  cleanQuickstartName,
} = require('./helpers');

/**
 * Returns any quickstart dashboards with matching names and their filepaths
 * @returns {[{name: string, path: string}]} An array of objects containing the name and filepath of a dashboard that is not unique
 */
const findMatchingDashboardNames = () => {
  const dashboardConfigs = glob.sync(
    path.resolve(process.cwd(), '../quickstarts/**/dashboards/*.+(json)')
  );

  const parsedDashboardConfigs = dashboardConfigs.map(readQuickstartFile);

  const dashboardNamesAndPaths = parsedDashboardConfigs.map((configFile) => ({
    name: cleanQuickstartName(configFile.contents[0].name),
    path: configFile.path,
  }));

  return getMatchingNames(dashboardNamesAndPaths);
};

const main = () => {
  const nameMatches = findMatchingDashboardNames();
  if (nameMatches.length > 0) {
    console.error(`ERROR: Found matching quickstart dashboard names`);
    console.error(`Punctuation and white space are removed before comparison`);
    nameMatches.forEach((m) =>
      console.error(`${m.name} in ${removeRepoPathPrefix(m.path)}`)
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
