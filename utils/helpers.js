'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');
const isImage = require('is-image');

/**
 * Read and parse a YAML file
 * @param {String} filePath - The path to the YAML file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
const readYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath);
  const contents = yaml.loadAll(file);
  return { path: filePath, contents };
};

/**
 * Read and parse a JSON file
 * @param {String} filePath - The path to the JSON file
 * @returns {{path: string, contents: Object}} An object containing the path and contents of the file
 */
const readJsonFile = (filePath) => {
  const file = fs.readFileSync(filePath);
  const contents = JSON.parse(file);
  return { path: filePath, contents: [contents] }; // Return array here to be consistent with the yaml reading
};

/**
 * Reads in a JSON or YAML file
 * @param {String} filePath - The path to the JSON or YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
const readQuickstartFile = (filePath) =>
  path.extname(filePath) === '.json'
    ? readJsonFile(filePath)
    : readYamlFile(filePath);

/**
 * Removes the current working directory from file paths
 * @returns {String} The path without the CWD prefix
 */
const removeCWDPrefix = (filePath) => filePath.split(`${process.cwd()}/`)[1];

/**
 * Checks the number of arguments passed to the script.
 * Will exit if the incorrect number of argument is passed in.
 * @param {number} length The desired number of arguments.
 */
const checkArgs = (length) => {
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
const removeRepoPathPrefix = (filePath) =>
  filePath.split(`newrelic-quickstarts/`).pop();

/**
 * Checks if a path is a direectory
 * @param {string} dir - The path to check
 * @returns {boolean} Whether path is a directory or not
 */
const isDirectory = (dir) => fs.statSync(dir).isDirectory();

/**
 * Counts the number of image files in a folder
 * @param {string} folder - The folder to count the image files from
 * @returns {number} The number of image type files in the folder
 */
const getImageCount = (folder) => {
  return [...glob.sync(path.resolve(folder, '**/*'))].filter((file) =>
    isImage(file)
  ).length;
};

/**
 * Gets the size of a file in Bytes
 * @param {string} file - The file to get the size of
 * @returns {Array} The file size in Bytes
 */
const getFileSize = (file) => {
  return fs.statSync(file)['size'];
};

/**
 * Parses the file extension type from a file path
 * @param {string} file - The file path to parse an extension from
 * @returns {string} The extension of the file
 */
const getFileExtension = (file) => {
  return path.extname(file);
};

/**
 * Gets an array of all files and directories in a path
 * @param {string} dir - The directory to parse, set by the BASE_PATH variable
 * @returns {Array} An array of pathnames of a globbed directory
 */
const globFiles = (dir) => {
  return glob.sync(path.resolve(dir, '**/*'));
};

/**
 * Finds the path to all top level quickstart configs
 * @returns {String[]} An array of the file paths
 */
const findMainQuickstartConfigFiles = () =>
  glob.sync(
    path.resolve(process.cwd(), '../quickstarts/**/config.+(yml|yaml)')
  );

/**
 * Finds the path to all top level install configs
 * @returns {String[]} An array of the file paths
 */
const findMainInstallConfigFiles = () =>
  glob.sync(path.resolve(process.cwd(), '../install/**/install.+(yml|yaml)'));

/**
 * Removes the first two arguments injected by Node
 * @returns {String[]} An array of arguments explicitly passed in via the command line
 */
const passedProcessArguments = () => process.argv.slice(2);

module.exports = {
  readYamlFile,
  readJsonFile,
  readQuickstartFile,
  removeCWDPrefix,
  removeRepoPathPrefix,
  checkArgs,
  getImageCount,
  getFileSize,
  getFileExtension,
  globFiles,
  isDirectory,
  findMainQuickstartConfigFiles,
  findMainInstallConfigFiles,
  passedProcessArguments,
};
