import { GITHUB_REPO_BASE_URL } from '../constants';
/**
 * Creates the GitHub url of an asset within the main directory of a quickstart.
 * @param assetFilePath - The file path of an asset.
 * @return Returns an object containing the GitHub url of an asset.
 */
export const getAssetSourceUrl = (assetFilePath: string): string => {
  // path = dashboards/apache/screenshot1.png
  return `${GITHUB_REPO_BASE_URL}/${assetFilePath}`;
};

/**
 * Removes the `newrelic-quickstarts/` path prefix from a string
 * @param filePath - The path to change
 * @returns - The path with the prefix
 */
export const removeRepoPathPrefix = (filePath: string): string => {
  const shortPath = filePath.split(`newrelic-quickstarts/`).pop();
  if (typeof shortPath === 'string') {
    return shortPath;
  }
  return filePath;
};
