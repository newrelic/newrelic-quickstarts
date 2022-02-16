'use strict';
const glob = require('glob');
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
  getMatchingNames,
  getQuickstartDashboardConfigs,
  cleanQuickstartName,
} = require('./helpers');

const findMatchingDashboardNames = () => {
  const quickstartMainConfigFilepaths = findMainQuickstartConfigFiles();

  const dashboardConfigs = quickstartMainConfigFilepaths
    .map((configFile) => {
      return getQuickstartDashboardConfigs(configFile);
    })
    .filter((filePaths) => filePaths.length !== 0)
    .flat();

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
  }

  if (require.main === module) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
