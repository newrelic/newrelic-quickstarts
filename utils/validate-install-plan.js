'use strict';

const {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
} = require('./github-api-helpers');
const { findMainInstallConfigFiles, readQuickstartFile } = require('./helpers');
const path = require('path');

const url = process.argv[2];

const getAllInstallPlanIds = () => {
  const configPaths = findMainInstallConfigFiles();
  return configPaths.reduce((acc, filePath) => {
    const { contents } = readQuickstartFile(filePath);

    const { id } = contents[0];
    return [...new Set([...acc, id])];
  }, []);
};

const getConfigInstallPlans = (configFiles) => {
  return configFiles.map(({ filename }) => {
    const filePath = path.join(process.cwd(), `../${filename}`);
    const { installPlans } = readQuickstartFile(filePath).contents[0];

    return { filePath, installPlans };
  });
};

const getInstallPlansNoMatches = (files, installPlanIds) => {
  return files
    .map(({ installPlans, filePath }) => {
      const nonExistentInstallPlans = installPlans.filter(
        (plan) => !installPlanIds.includes(plan)
      );
      return { filePath, installPlans: nonExistentInstallPlans };
    })
    .filter(({ installPlans }) => installPlans.length > 0);
};

const validateInstallPlanIds = (files) => {
  const configFiles = filterQuickstartConfigFiles(files);

  const configInstallPlans = getConfigInstallPlans(configFiles);
  const installPlanIds = getAllInstallPlanIds();

  const installPlanNoMatches = getInstallPlansNoMatches(
    configInstallPlans,
    installPlanIds
  );

  if (installPlanNoMatches.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding install plan id.`
    );
    console.error(
      `An install plan id must match an existing install plan id.\n`
    );
    installPlanNoMatches.forEach((m) =>
      console.error(`${m.installPlans.join(', ')} in ${m.filePath}\n`)
    );
    console.error(
      `Please change to an existing install plan id or remove the ids.`
    );

    if (require.main === module) {
      process.exit(1);
    }
  }
};

const main = async () => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  validateInstallPlanIds(files);
};

if (require.main === module) {
  main();
}

module.exports = {
  validateInstallPlanIds,
  getConfigInstallPlans,
  getInstallPlansNoMatches,
  getAllInstallPlanIds,
};
