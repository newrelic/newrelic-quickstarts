'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const glob = require('glob');


/**
 * Read and parse a YAML file
 * @param {String} filePath - The path to the YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
const readYamlFile = (filePath) => {
  const file = fs.readFileSync(filePath);
  const contents = yaml.loadAll(file);
  return { path: filePath, contents };
}

/**
 * Read and parse a JSON file
 * @param {String} filePath - The path to the JSON file
 * @returns {Object} An object containing the path and contents of the file
 */
const readJsonFile = (filePath) => {
  const file = fs.readFileSync(filePath);
  const contents = JSON.parse(file);
  return { path: filePath, contents: [ contents ] }; // Return array here to be consistent with the yaml reading
}

/**
 * Reads in a JSON or YAML file
 * @param {String} filePath - The path to the JSON or YAML file
 * @returns {Object} An object containing the path and contents of the file
 */
const readFile = (filePath) => path.extname(filePath) === '.json' ? readJsonFile(filePath) : readYamlFile(filePath);

/**
 * Finds the path to all top level pack configs
 * @returns {String[]} An array of the file paths
 */
const findMainPackConfigFiles = () => glob.sync(path.resolve(process.cwd(), 'packs/**/config.yml')); 

/**
 * Removes the current working directory from file paths
 * @returns {String} The path without the CWD prefix
 */
const removeCWDPrefix = (filePath) => filePath.split(`${process.cwd()}/`)[1];

module.exports = { readYamlFile, readJsonFile, readFile, findMainPackConfigFiles, removeCWDPrefix };
