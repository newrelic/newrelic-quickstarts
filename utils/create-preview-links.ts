import Quickstart from './lib/Quickstart';
import * as path from 'path';
import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
} from './lib/github-api-helpers';
import { IO_PREVIEW_PAGE_URL } from './constants';
import {
  prop,
  getRelatedQuickstarts,
  getComponentLocalPath,
} from './lib/helpers';
import { QUICKSTART_CONFIG_REGEXP, COMPONENT_PREFIX_REGEXP } from './constants';

/**
 * Retrieves the individual quickstarts changed or created in a pull request
 * @param prURL - The Github API URL for a pull request
 * @param token - A Github access token
 * @returns The local file path for each quickstart. Ex: ['apache', 'aws/amazon-msk']
 */
export const getQuickstartsFromPRFiles = async (
  prURL: string,
  token: string
): Promise<string[]> => {
  const filesURL = `${prURL}/files`;
  const files = await fetchPaginatedGHResults(filesURL, token);
  const nonTestFiles = filterOutTestFiles(files);
  
  const quickstartPaths = nonTestFiles
      .map(prop('filename'))
      .filter(filePath => QUICKSTART_CONFIG_REGEXP.test(filePath))
      .map(filePath => path.dirname(filePath.split('quickstarts/').pop()!))

  /*
    We can rely on a quickstart existing on the `main` branch because if it isn't, then it was created in this 
    pull request and will be caught by the logic above. We can then use the Quickstart class with 
    getRelatedQuickstarts to get all quickstarts related to the component.  If
    the component itself exists we know a quickstart related to it also exists.
  */
  const componentPaths = nonTestFiles
    .map(prop('filename'))
    .filter(filePath => COMPONENT_PREFIX_REGEXP.test(filePath))
    .flatMap(filePath => getRelatedQuickstarts(getComponentLocalPath(filePath)))
    .map(quickstart => path.dirname(quickstart.configPath.split('newrelic-quickstarts/').pop()!))
    .map((configPath) => configPath.split('quickstarts/').pop()!);

  return [...new Set([...quickstartPaths, ...componentPaths])];
};

/**
 * Creates a link to the IO preview page for a particular quickstart
 * @param prNumber - The Github pull request number
 * @param quickstartPath - The local file path to a quickstart. Ex: 'apache' or 'aws/amazon-msk'
 * @returns A URL to the IO preview page with the required parameters
 */
export const createPreviewLink = (
  prNumber: string,
  quickstartPath: string
): string => {
  const url = new URL(IO_PREVIEW_PAGE_URL);

  url.searchParams.set('pr', prNumber);
  url.searchParams.set('quickstart', quickstartPath);

  return url.href;
};

/**
 * Creates a string that includes links to each quickstart preview, used as a pull request comment
 * @param quickstarts - An array of objects that include the local path for a quickstart and its associated preview link
 * @returns A string to be used as a Github pull request comment
 */
export const createComment = (
  quickstarts: { path: string; link: string }[]
): string => {
  const heading = `### Click the link(s) below to view a preview of your changes on newrelic.com/instant-observability<br/><br/>`;

  const markdownLinks = quickstarts
    .map((q) => `- [${q.path}](${q.link})`)
    .join('<br/>');

  return `${heading}${markdownLinks}`;
};

/**
 * Executes this script to create a pull request comment with preview links for each quickstart in the pull request
 * Requires the `GITHUB_TOKEN` environment variable to be set to a Github access token
 * @param [prURL] - The Github API URL to the pull request
 * @param [prNumber] - The Github pull request number
 * @param [token] - A Github access token
 */
export const generatePreviewComment = async (
  prURL?: string,
  prNumber?: string,
  token?: string
): Promise<boolean> => {
  if (!token) {
    console.error(`Missing GITHUB_TOKEN environment variable`);
    return false;
  }

  if (!prURL || !prNumber) {
    console.error(
      `Missing arguments. Example: ts-node create-preview-links.ts <pull request url> <github token>`
    );
    return false;
  }

  try {
    console.log(`Fetching PR: ${prURL}`);
    const quickstarts = await getQuickstartsFromPRFiles(prURL, token);

    console.log(`Found ${quickstarts.length} quickstart(s)`);
    const links = quickstarts.map((q) => ({
      path: q,
      link: createPreviewLink(prNumber, q),
    }));

    if (links.length > 0) {
      const comment = createComment(links);
      console.log(`::set-output name=comment::${comment}`);
    } else {
      console.log(`No quickstarts found, skipping preview`);
    }
  } catch (err) {
    console.error(err);
    return false;
  }

  return true;
};

/**
 * Gathers environment variables and arguments, then executes the script
 */
const main = async () => {
  const isSuccess = await generatePreviewComment(
    process.argv[2],
    process.argv[3],
    process.env.GITHUB_TOKEN
  );

  if (!isSuccess) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'ts-node create-preview-link.ts', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
