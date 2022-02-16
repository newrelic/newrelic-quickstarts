'use strict';
const glob = require('glob');
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
} = require('./helpers');

const getQuickstartDashboardConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*.+(json)`;

  return glob.sync(globPattern);
};

const getMatchingNames = (namesAndPaths) => {
  return namesAndPaths.reduce((acc, { name, path }) => {
    const duplicates = namesAndPaths.filter(
      (quickstart) => quickstart.name === name && quickstart.path !== path
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const cleanQuickstartName = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');

const findMatchingDashboardNames = () => {
  const quickstartConfigFilepaths = findMainQuickstartConfigFiles();

  const dashboardConfigs = quickstartConfigFilepaths
    .map((configFile) => {
      return getQuickstartDashboardConfigs(configFile);
    })
    .filter((x) => x.length !== 0)
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
