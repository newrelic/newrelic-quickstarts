import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  filterOutTestFiles,
  GithubAPIPullRequestFile,
  isNotRemoved,
} from './lib/github-api-helpers';

import Quickstart from './lib/Quickstart';
import InstallPlan from './lib/InstallPlan';
import { passedProcessArguments } from './lib/helpers';

/**
 * Main validation logic ensuring install plans specified in config files actually exist
 */
export const validateInstallPlanIds = (
  githubFiles: GithubAPIPullRequestFile[]
) => {
  const configFiles: GithubAPIPullRequestFile[] =
    filterQuickstartConfigFiles(githubFiles);
  const existingConfigFiles: GithubAPIPullRequestFile[] =
    configFiles.filter(isNotRemoved); // Filter out deleted files

  const quickstarts = existingConfigFiles.map(
    ({ filename }) => new Quickstart(filename)
  );

  const quickstartsWithInvalidInstall = quickstarts
    .map((quickstart) => {
      const invalidIds =
        quickstart.config.installPlans?.filter((installPlanId) => {
          return !new InstallPlan(installPlanId).isValid;
        }) ?? [];

      return {
        quickstart,
        invalidInstallPlans: invalidIds,
      };
    })
    .filter((q) => q.invalidInstallPlans.length > 0);

  if (quickstartsWithInvalidInstall.length > 0) {
    console.error(
      `ERROR: Found install plans with no corresponding install plan id.\n`
    );
    console.error(`An install plan id must match an existing install plan id.`);
    quickstartsWithInvalidInstall.forEach((m) =>
      console.error(
        `- ${m.invalidInstallPlans.join(', ')} in ${m.quickstart.configPath}`
      )
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
  const [GITHUB_API_URL] = passedProcessArguments();
  const githubToken = process.env.GITHUB_TOKEN;

  if (!githubToken) {
    console.error('GITHUB_TOKEN is not defined.');
    process.exit(1);
  }
  const files = await fetchPaginatedGHResults(GITHUB_API_URL, githubToken);
  validateInstallPlanIds(filterOutTestFiles(files));
};

if (require.main === module) {
  main();
}
