'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

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
  path.extname(filePath) === '.json'
    ? readJsonFile(filePath)
    : readYamlFile(filePath);

/**
 * Removes the current working directory from file paths
 * @returns {String} The path without the CWD prefix
 */
const removeCWDPrefix = (filePath) => filePath.split(`${process.cwd()}/`)[1];

/**
 * Removes the `newrelic-observability-packs/` path prefix from a string
 * @param {String} filePath the path to change
 * @returns {String} The path with the prefix
 */
const removeRepoPathPrefix = (filePath) => filePath.split(`newrelic-observability-packs/`).pop();

module.exports = { readYamlFile, readJsonFile, readPackFile, removeCWDPrefix, removeRepoPathPrefix };
