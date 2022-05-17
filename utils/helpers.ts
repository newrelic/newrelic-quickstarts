import * as fs from 'fs';
import * as path from 'path';
import * as yaml from 'js-yaml';
import * as glob from 'glob';
import isImage from 'is-image';

export interface FilePathAndContents<T> {
  path: string;
  contents: T[];
}

/**
 * Read and parse a YAML file
 * @param {String} filePath - The path to the YAML file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
export const readYamlFile = <T>(filePath: string): FilePathAndContents<T> => {
  const file = fs.readFileSync(filePath);
  const contents = yaml.loadAll(file.toString('utf-8')) as T[];
  return { path: filePath, contents };
};

/**
 * Read and parse a JSON file
 * @param {String} filePath - The path to the JSON file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
export const readJsonFile = <T>(filePath: string): FilePathAndContents<T> => {
  const file = fs.readFileSync(filePath);
  const contents = JSON.parse(file.toString('utf-8'));
  return { path: filePath, contents: [contents] }; // Return array here to be consistent with the yaml reading
};

/**
 * Reads in a JSON or YAML file
 * @param {String} filePath - The path to the JSON or YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
export const readQuickstartFile = <T>(
  filePath: string
): FilePathAndContents<T> =>
  path.extname(filePath) === '.json'
    ? readJsonFile(filePath)
    : readYamlFile(filePath);

/**
 * Removes the current working directory from file paths
 * @returns {String} The path without the CWD prefix
 */
export const removeCWDPrefix = (filePath: string): string =>
  filePath.split(`${process.cwd()}/`)[1];

/**
 * Checks the number of arguments passed to the script.
 * Will exit if the incorrect number of argument is passed in.
 * @param {number} length The desired number of arguments.
 */
export const checkArgs = (length: number) => {
  const { argv } = process;

  if (argv.length !== length) {
    console.error(
      `[!] Expected ${length - 2} argument(s), recieved ${argv.length - 2}:`
    );

    for (const arg of argv.slice(2)) {
      console.log(`\t(${argv.indexOf(arg) - 2}) ${arg}`);
    }

    process.exit(1);
  }
};

/**
 * Removes the `newrelic-quickstarts/` path prefix from a string
 * @param {String} filePath the path to change
 * @returns {String} The path with the prefix
 */
export const removeRepoPathPrefix = (filePath: string): string => {
  const shortPath = filePath.split(`newrelic-quickstarts/`).pop();
  if (typeof shortPath === 'string') {
    return shortPath;
  }
  return filePath;
};

/**
 * Checks if a path is a direectory
 * @param {string} dir - The path to check
 * @returns {boolean} Whether path is a directory or not
 */
export const isDirectory = (dir: string): boolean =>
  fs.statSync(dir).isDirectory();

/**
 * Counts the number of image files in a folder
 * @param {string} folder - The folder to count the image files from
 * @returns {number} The number of image type files in the folder
 */
export const getImageCount = (folder: string): number => {
  return [...glob.sync(path.resolve(folder, '**/*'))].filter((file) =>
    isImage(file)
  ).length;
};

/**
 * Gets the size of a file in Bytes
 * @param {string} filePath - The file to get the size of
 * @returns {Array} The file size in Bytes
 */
export const getFileSize = (filePath: string): number => {
  return fs.statSync(filePath)['size'];
};

/**
 * Parses the file extension type from a file path
 * @param {string} filePath - The file path to parse an extension from
 * @returns {string} The extension of the file
 */
export const getFileExtension = (filePath: string): string => {
  return path.extname(filePath);
};

/**
 * Gets an array of all files and directories in a path
 * @param {string} dir - The directory to parse, set by the BASE_PATH variable
 * @returns {Array} An array of pathnames of a globbed directory
 */
export const globFiles = (dir: string): String[] => {
  return glob.sync(path.resolve(dir, '**/*'));
};

/**
 * Finds the path to all top level quickstart configs
 * @returns {String[]} An array of the file paths
 */
export const findMainQuickstartConfigFiles = (): string[] =>
  glob.sync(
    path.resolve(process.cwd(), '../quickstarts/**/config.+(yml|yaml)')
  );

/**
 * Finds the path to all top level install configs
 * @returns {String[]} An array of the file paths
 */
export const findMainInstallConfigFiles = (): string[] =>
  glob.sync(path.resolve(process.cwd(), '../install/**/install.+(yml|yaml)'));

/**
 * Removes the first two arguments injected by Node
 * @returns {String[]} An array of arguments explicitly passed in via the command line
 */
export const passedProcessArguments = (): string[] => process.argv.slice(2);

interface NameAndPath {
  name: string;
  path: string;
}
/**
 * Returns any quickstarts with matching names
 * @param {Object[]} namesAndPaths an array of objects containing the path and name of a quickstart
 * @returns {Object[]} an array of matching values
 */
export const getMatchingNames = (
  namesAndPaths: NameAndPath[]
): NameAndPath[] => {
  return namesAndPaths.reduce<NameAndPath[]>((acc, { name, path }) => {
    const duplicates = namesAndPaths.filter(
      (quickstart) => quickstart.name === name && quickstart.path !== path
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

/**
 * Removes whitespace and punctuation from a string
 * @returns {String} The string with `-` replacing whitespace and punctuation removed
 */
export const cleanQuickstartName = (str: string): string =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Gets the unique base quickstart directory from a given file path.
 * e.g. filePath: 'quickstarts/python/aiohttp/alerts/ApdexScore.yml' + targetChild: 'alerts' = 'python/aiohttp'.
 * @param {String} filePath - Full file path of a file in a quickstart.
 * @param {String} targetChild - Node in file path that should be preceded by a base quickstart directory.
 * @return {String} Node in file path of the quickstart.
 */
const getQuickstartNode = (
  filePath: string,
  targetChild: string | undefined
): string => {
  const splitFilePath = filePath.split('/');

  const baseQuickstartDirectoryIndex =
    splitFilePath.findIndex((path) => path === targetChild) - 1;

  let uniqueQuickstartDirectory = splitFilePath[baseQuickstartDirectoryIndex];
  let indexCounter = baseQuickstartDirectoryIndex;

  while (indexCounter > 1) {
    uniqueQuickstartDirectory = splitFilePath[indexCounter - 1].concat(
      `/${uniqueQuickstartDirectory}`
    );
    indexCounter--;
  }
  return uniqueQuickstartDirectory;
};

/**
 * Identifies where in a given file path to look for a quickstart directory.
 * @param {String} filePath - Full file path of a file in a quickstart.
 * @return {String|undefined} Called function with arguments to determine the quickstart of a given file path.
 */
export const getQuickstartFromFilename = (
  filePath: string
): string | undefined => {
  if (!filePath.includes('quickstarts/')) {
    return undefined;
  }

  if (filePath.includes('/alerts/')) {
    return getQuickstartNode(filePath, 'alerts');
  }

  if (filePath.includes('/dashboards/')) {
    return getQuickstartNode(filePath, 'dashboards');
  }

  if (filePath.includes('/images/')) {
    return getQuickstartNode(filePath, 'images');
  }

  const targetChildNode = filePath.split('/').pop();

  return getQuickstartNode(filePath, targetChildNode);
};

/**
 * Reducer function that builds a set of unique quickstarts that were updated in a given PR.
 * @param {Set<string>} acc - A set of unique quickstarts being built by the reducer function.
 * @param {Object} curr - A result from the GitHub API.
 * @return {Set} A set of strings representing the unique quickstarts updated in a PR.
 */
export const buildUniqueQuickstartSet = (
  acc: Set<string>,
  { filename }: { filename: string }
): Set<string> => {
  const quickstartFileName = getQuickstartFromFilename(filename);
  return quickstartFileName ? acc.add(quickstartFileName) : acc;
};
