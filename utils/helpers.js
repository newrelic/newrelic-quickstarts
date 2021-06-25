"use strict";
const fs = require("fs");
const path = require("path");
const yaml = require("js-yaml");

/**
 * Read and parse a YAML file
 * @param {String} filePath - The path to the YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
const readYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath);
  const contents = yaml.loadAll(file);
  return { path: filePath, contents };
};

/**
 * Read and parse a JSON file
 * @param {String} filePath - The path to the JSON file
 * @returns {Object} An object containing the path and contents of the file
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
const readPackFile = (filePath) =>
  path.extname(filePath) === ".json"
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

module.exports = {
  readYamlFile,
  readJsonFile,
  readPackFile,
  removeCWDPrefix,
  checkArgs
};
