'use strict';
const path = require('path');
const glob = require('glob');
const { 
  readFile, 
  removeCWDPrefix 
} = require('./helpers');

/**
 * Finds the path to all top level pack configs
 * @returns {String[]} An array of the file paths
 */
const findMainPackConfigFiles = () => glob.sync(path.resolve(process.cwd(), 'packs/**/config.yml')); 

/**
 * Removes whitespace and punctuation from a string
 * @returns {String} The string with `-` replacing whitespace and punctuation removed
 */
const cleanPackName = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Returns any packs with matching names
 * @param {Object[]} namesAndPaths an array of objects containing the path and name of a pack
 * @returns {Object[]|undefined} an array of matching values or undefined if there are none
 */
const getMatchingNames = (namesAndPaths) => {
  const nameSet = new Set();
  for (const p of namesAndPaths) {
    if (nameSet.has(p.name)) {
      return namesAndPaths.filter(pack => pack.name === p.name);
    }

    nameSet.add(p.name);
  }
};

const main = () => {
  const configPaths = findMainPackConfigFiles();
  const configs = configPaths.map(readFile);
  const nameAndPaths = configs.map(c => ({ name: cleanPackName(c.contents[0].name), path: c.path }));
  const matches = getMatchingNames(nameAndPaths);

  if (matches) {
    console.error(`ERROR: Found matching Observability Pack names`);
    console.error(`Punctuation and white space are removed before comparison`);
    matches.map(m => console.error(`${m.name} in ${removeCWDPrefix(m.path)}`)); 
    console.error(`Please update your pack's name to be unique`);

    if (require.main === module) {
      process.exit(1);
    }
  }
  else {
    console.log(`All Observability Pack names are unique`);
  }
}

if (require.main === module) {
  main();
}

module.exports = main;
