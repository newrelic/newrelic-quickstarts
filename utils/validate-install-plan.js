'use strict';

const { fetchPaginatedGHResults } = require('./github-api-helpers');
const {
  findMainQuickstartConfigFiles,
  readQuickstartFile,
} = require('./helpers');
const path = require('path');

const url = process.argv[2];

const CONFIG_REGEXP = new RegExp('quickstarts/.+/config.+(yml|yaml|json)');

const getAllInstallPlanIds = (newFiles) => {
  const configPaths = findMainQuickstartConfigFiles();
  const existingInstallPlanIds = configPaths.reduce((acc, filePath) => {
    const { contents, path: configPath } = readQuickstartFile(filePath);

    if (newFiles.find(({ filePath }) => filePath === configPath)) {
      return acc;
    }

    const installPlans = contents && contents[0].installPlans;
    if (installPlans) {
      return [...new Set([...acc, ...installPlans])];
    }
    return acc;
  }, []);
  return existingInstallPlanIds;
};

const main = async () => {
  const files = await fetchPaginatedGHResults(url, process.env.GITHUB_TOKEN);
  const configFiles = files.filter(({ filename }) =>
    CONFIG_REGEXP.test(filename)
  );

  const fileContents = configFiles.map(({ filename }) => {
    const filePath = path.join(process.cwd(), `../${filename}`);
    const { installPlans } = readQuickstartFile(filePath).contents[0];

    return { filePath, installPlans };
  });

  const installPlanIds = getAllInstallPlanIds(fileContents);

  const validateInstallPlanExists = fileContents.map(
    ({ installPlans, filePath }) => {
      const errors = [];
      const nonExistentInstallPlans = installPlans.filter(
        (plan) => !installPlanIds.includes(plan)
      );

      if (nonExistentInstallPlans.length !== 0) {
        errors.push(
          `ERROR: There are no install plans with the following ids: ${nonExistentInstallPlans.toString()}`
        );
      }

      return { errors, installPlans, filePath };
    }
  );
  console.log(validateInstallPlanExists);
};

main();
