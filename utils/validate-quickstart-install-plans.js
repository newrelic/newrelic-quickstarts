'use strict';
const path = require('path');
const {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
} = require('./github-api-helpers');
const {
  findMainInstallConfigFiles,
  readQuickstartFile,
  passedProcessArguments,
} = require('./helpers');

const GITHUB_API_URL = passedProcessArguments()[0];

/**
 * Gets all install plain ids under installs/ dir
 * @returns {Array} Array of unique install plan ids
 */
const getAllInstallPlanIds = () => {
  return findMainInstallConfigFiles().reduce((acc, filePath) => {
    const { contents } = readQuickstartFile(filePath);

    const { id } = contents[0];
    return [...new Set([...acc, id])];
  }, []);
};

/**
 * Gets all the install plans and paths for an array of config files
 * @param {Array} configFiles - Array of config files
 * @returns {{filePath: string, installPlans: Array}[]} Array of paths and install plans for file
 */
const getConfigInstallPlans = (configFiles) => {
  return configFiles.map(({ filename }) => {
    const filePath = path.join(process.cwd(), `../${filename}`);
    const installPlans =
      readQuickstartFile(filePath).contents[0]?.installPlans || [];

    return { filePath, installPlans };
  });
};

/**
 * Gets the set of install plans specified in config files but not actually existing
 * @param {{filePath, installPlans}[]} configInstallPlanFiles - Array of objects with path and install plans for file
 * @param {String[]} installPlanIds - Array of install plan ids
 * @returns {{filePath, installPlans}[]} Array of paths and install plans for file
 */
const getInstallPlansNoMatches = (configInstallPlanFiles, installPlanIds) => {
  return configInstallPlanFiles
    .map(({ installPlans, filePath }) => {
      const nonExistentInstallPlans = installPlans.filter(
        (plan) => !installPlanIds.includes(plan)
      );
      return { filePath, installPlans: nonExistentInstallPlans };
    })
    .filter(({ installPlans }) => installPlans.length > 0);
};

/**
 * Main validation logic ensuring install plans specified in config files actually exist
 * @param {Array} githubFiles - Array of results from Github API
 */
const validateInstallPlanIds = (githubFiles) => {
  const configFiles = filterQuickstartConfigFiles(githubFiles);

  const configInstallPlansFiles = getConfigInstallPlans(configFiles);

  const installPlanIds = getAllInstallPlanIds();

  const installPlanNoMatches = getInstallPlansNoMatches(
    configInstallPlansFiles,
    installPlanIds
  );

  if (installPlanNoMatches.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding install plan id.\n`
    );
    console.error(`An install plan id must match an existing install plan id.`);
    installPlanNoMatches.forEach((m) =>
      console.error(`- ${m.installPlans.join(', ')} in ${m.filePath}`)
    );
    console.error(
      `\nPlease change to an existing install plan id or remove the ids.`
    );

    if (require.main === module) {
      process.exit(1);
    }
  }
};

const main = async () => {
  const files = await fetchPaginatedGHResults(
    GITHUB_API_URL,
    process.env.GITHUB_TOKEN
  );
  validateInstallPlanIds(filterOutTestFiles(files));
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
