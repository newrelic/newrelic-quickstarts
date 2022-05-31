'use strict';
import * as path from 'path';
import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  GithubAPIPullRequestFile
} from './github-api-helpers';

import {
  findMainInstallConfigFiles,
  readQuickstartFile,
  passedProcessArguments,
  FilePathAndContents
} from './helpers';
import { InstallPlanConfig } from './types/InstallPlanConfig';
import { QuickstartConfig } from './types/QuickstartConfig';

const GITHUB_API_URL: string = passedProcessArguments()[0];

/**
 * Gets all install plain ids under installs/ dir
 * @returns {Array} Array of unique install plan ids
 */
const getAllInstallPlanIds = () => {
  return findMainInstallConfigFiles().reduce((acc: string[], filePath: string) => {
    const { contents } = readQuickstartFile<InstallPlanConfig>(filePath);

    const { id } = contents[0];
    return [...new Set([...acc, id])];
  }, []);
};

/**
 * Gets all the install plans and paths for an array of config files
 * @param {Array} configFiles - Array of config files
 * @returns {{filePath: string, installPlans: Array}[]} Array of paths and install plans for file
 */
const getConfigInstallPlans = (
  configFiles: GithubAPIPullRequestFile[]
  ) => {
  return configFiles.map(({ filename }) => {
    const filePath: string = path.join(process.cwd(), `../${filename}`);
    const installPlans: string[] =
      readQuickstartFile<QuickstartConfig>(filePath).contents[0]?.installPlans || [];

    return { path: filePath, contents: installPlans };
  });
};

/**
 * Gets the set of install plans specified in config files but not actually existing
 * @param {{filePath, installPlans}[]} configInstallPlanFiles - Array of objects with path and install plans for file
 * @param {String[]} installPlanIds - Array of install plan ids
 * @returns {{filePath, installPlans}[]} Array of paths and install plans for file
 */
const getInstallPlansNoMatches = (configInstallPlanFiles: FilePathAndContents<string>[], installPlanIds: string[]) => {
  return configInstallPlanFiles
    .map(({ contents, path }: FilePathAndContents<string>) => {
      const nonExistentInstallPlans = contents.filter(
        (plan: string) => !installPlanIds.includes(plan)
      );
      return { path, contents: nonExistentInstallPlans };
    })
    .filter(({ contents }: FilePathAndContents<string>) => contents.length > 0);
};

/**
 * Main validation logic ensuring install plans specified in config files actually exist
 * @param {Array} githubFiles - Array of results from Github API
 */
const validateInstallPlanIds = (githubFiles: GithubAPIPullRequestFile[]) => {
  const configFiles: GithubAPIPullRequestFile[] = filterQuickstartConfigFiles(githubFiles);
  const existingConfigFiles: GithubAPIPullRequestFile[] = configFiles.filter(
    (cf: GithubAPIPullRequestFile) => cf.status !== 'removed'
  ); // Filter out deleted files

  const configInstallPlansFiles: FilePathAndContents<string>[] = getConfigInstallPlans(existingConfigFiles);

  const installPlanIds: string[] = getAllInstallPlanIds();

  const installPlanNoMatches: FilePathAndContents<string>[] = getInstallPlansNoMatches(
    configInstallPlansFiles,
    installPlanIds
  );

  if (installPlanNoMatches.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding install plan id.\n`
    );
    console.error(`An install plan id must match an existing install plan id.`);
    installPlanNoMatches.forEach((m: FilePathAndContents<string>) =>
      console.error(`- ${m.contents.join(', ')} in ${m.path}`)
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
