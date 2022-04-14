import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import glob from 'glob';
import isImage from 'is-image';

interface FilePathAndContents {
  path: string;
  contents: object;
}

/**
 * Read and parse a YAML file
 * @param {String} filePath - The path to the YAML file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
export const readYamlFile = (filePath: string): FilePathAndContents => {
  const file = fs.readFileSync(filePath);
  const contents = yaml.loadAll(file.toString('utf-8'));
  return { path: filePath, contents };
};

/**
 * Read and parse a JSON file
 * @param {String} filePath - The path to the JSON file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
export const readJsonFile = (filePath: string): FilePathAndContents => {
  const file = fs.readFileSync(filePath);
  const contents = JSON.parse(file.toString('utf-8'));
  return { path: filePath, contents: [contents] }; // Return array here to be consistent with the yaml reading
};

/**
 * Reads in a JSON or YAML file
 * @param {String} filePath - The path to the JSON or YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
export const readQuickstartFile = (filePath: string): FilePathAndContents =>
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
export const removeRepoPathPrefix = (filePath: string): string =>
  filePath.split(`newrelic-quickstarts/`).pop();

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

/**
 * Returns any quickstarts with matching names
 * @param {Object[]} namesAndPaths an array of objects containing the path and name of a quickstart
 * @returns {Object[]} an array of matching values
 */
export const getMatchingNames = (
  namesAndPaths: { name: string; path: string }[]
): object[] => {
  return namesAndPaths.reduce((acc, { name, path }) => {
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
