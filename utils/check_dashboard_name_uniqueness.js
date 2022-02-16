'use strict';
const glob = require('glob');
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
} = require('./helpers');

// get quickstartconfig path
const getQuickstartDashboardConfigs = (quickstartConfigPath) => {
  const splitConfigPath = quickstartConfigPath.split('/');
  splitConfigPath.pop();
  const globPattern = `${splitConfigPath.join('/')}/dashboards/*.+(json)`;

  return glob.sync(globPattern);
};
//read quickstart dashboard config path
// extract name
// const parsedConfig = readQuickstartFile(dashboardConfigPath);
// const { name } = parsedConfig.contents[0];
// compare incoming to already existing

const main = () => {
  const quickstartConfigFilepaths = findMainQuickstartConfigFiles();
  const dashboardConfigs = quickstartConfigFilepaths
    .map((configFile) => {
      return getQuickstartDashboardConfigs(configFile);
    })
    .filter((x) => x.length !== 0)
    .flat();

  console.log(dashboardConfigs);
};

if (require.main === module) {
  main();
}
