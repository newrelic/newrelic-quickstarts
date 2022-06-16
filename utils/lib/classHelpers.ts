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
 * Removes the specified path prefix from a file path
 * @param filePath - The path to change
 * @param basePath - The portion of the path to remove
 * @returns - The path with the prefix
 */
export const removeBasePath = (filePath: string, basePath: string): string => {
  const shortPath = filePath.split(`${basePath}/`).pop();
  if (typeof shortPath === 'string') {
    return shortPath;
  }
  return filePath;
};
