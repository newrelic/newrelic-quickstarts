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
 */
export const getAllInstallPlanIds = () => {
  return findMainInstallConfigFiles().reduce((acc: string[], filePath: string) => {
    const { contents } = readQuickstartFile<InstallPlanConfig>(filePath);

    const { id } = contents[0];
    return [...new Set([...acc, id])];
  }, []);
};

/**
 * Gets all the install plans and paths for an array of config files
 */
export const getConfigInstallPlans = (
  configFiles: GithubAPIPullRequestFile[]
  ) => {
  return configFiles.map(({ filename }) => {
    const filePath: string = path.join(process.cwd(), `../${filename}`);
    const installPlans: string[] =
      readQuickstartFile<QuickstartConfig>(filePath).contents[0]?.installPlans || [];

    return { path: filePath, contents: installPlans };
  });
};

export const getInstallPlansNoMatches = (configInstallPlanFiles: FilePathAndContents<string>[], installPlanIds: string[]) => {
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
 */
export const validateInstallPlanIds = (githubFiles: GithubAPIPullRequestFile[]) => {
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
  const githubToken = process.env.GITHUB_TOKEN;
  
  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }
  const files = await fetchPaginatedGHResults(
    GITHUB_API_URL,
    githubToken
  );
  validateInstallPlanIds(filterOutTestFiles(files));
};

if (require.main === module) {
  main();
}
