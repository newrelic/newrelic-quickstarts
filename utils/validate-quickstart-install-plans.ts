import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  GithubAPIPullRequestFile
} from './lib/github-api-helpers';

import Quickstart from './lib/Quickstart';
import InstallPlan from './lib/InstallPlan';
import { InstallPlanConfig } from './types/InstallPlanConfig';
import { QuickstartConfig } from './types/QuickstartConfig';
import { passedProcessArguments } from './lib/helpers';


/**
 * Gets all install plan ids under `installs/` dir
 * @returns - An array of install plan Ids
 */
export const getAllInstallPlanIds = () => {
  return InstallPlan.getAll().reduce<InstallPlanConfig["id"][]>(
    (acc, installPlan) => {
      const { id } = installPlan.config;

      return [...new Set([...acc, id])];
    },
    []
  );
};

interface ConfigInstallPlanFiles {
  configPath: string;
  installPlanIds: QuickstartConfig["installPlans"];
}
/**
 * Gets all quickstart config paths and install plan Ids from respective quickstart. 
 * @returns - An array of quickstart paths and installPlanIds
 */
export const getInstallPlanIds = (
  githubFiles: GithubAPIPullRequestFile[]
  ): ConfigInstallPlanFiles[] => {
  return githubFiles.map(({ filename }) => {
    const quickstart = new Quickstart(filename);
    const installPlans: string[] =
      quickstart.config?.installPlans ?? [];

    return { configPath: quickstart.configPath, installPlanIds: installPlans };
  });
};

/**
 * Finds quickstarts that references an install plan id that does not exist.
 * @returns - An array of quickstarts with install plans that do not exist.
 */
export const getInstallPlansNoMatches = (configInstallPlanFiles: ConfigInstallPlanFiles[], allInstallPlanIds: string[]): ConfigInstallPlanFiles[] => {
  return configInstallPlanFiles
    .map(({ installPlanIds, configPath }) => {
      const nonExistentInstallPlans =
        installPlanIds?.filter(
          (plan: string) => !allInstallPlanIds.includes(plan)
        ) ?? [];
      return {
        configPath: configPath,
        installPlanIds: nonExistentInstallPlans,
      };
    })
    .filter(({ installPlanIds }) => installPlanIds.length > 0);
};

/**
 * Main validation logic ensuring install plans specified in config files actually exist
 */
export const validateInstallPlanIds = (githubFiles: GithubAPIPullRequestFile[]) => {
  const configFiles: GithubAPIPullRequestFile[] = filterQuickstartConfigFiles(githubFiles);
  const existingConfigFiles: GithubAPIPullRequestFile[] = configFiles.filter(
    (cf: GithubAPIPullRequestFile) => cf.status !== 'removed'
  ); // Filter out deleted files

  const configInstallPlansFiles = getInstallPlanIds(existingConfigFiles);

  const allInstallPlanIds = getAllInstallPlanIds();

  const installPlanNoMatches = getInstallPlansNoMatches(
    configInstallPlansFiles,
    allInstallPlanIds
  );

  if (installPlanNoMatches.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding install plan id.\n`
    );
    console.error(`An install plan id must match an existing install plan id.`);
    installPlanNoMatches.forEach((m) =>
      console.error(`- ${m.installPlanIds!.join(', ')} in ${m.configPath}`)
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
  const [ GITHUB_API_URL ] = passedProcessArguments();
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
