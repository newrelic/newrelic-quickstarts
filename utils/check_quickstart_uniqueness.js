'use strict';
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
} = require('./helpers');

/**
 * Removes whitespace and punctuation from a string
 * @returns {String} The string with `-` replacing whitespace and punctuation removed
 */
const cleanQuickstartName = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Returns any quickstarts with matching names
 * @param {Object[]} namesAndPaths an array of objects containing the path and name of a quickstart
 * @returns {Object[]} an array of matching values
 */
const getMatchingNames = (namesAndPaths) => {
  return namesAndPaths.reduce((acc, { name, path }) => {
    const duplicates = namesAndPaths.filter(
      (quickstart) => quickstart.name === name && quickstart.path !== path
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const main = () => {
  const configPaths = findMainQuickstartConfigFiles();
  const configs = configPaths.map(readQuickstartFile);
  const nameAndPaths = configs.map((c) => ({
    name: cleanQuickstartName(c.contents[0].name),
    path: c.path,
  }));
  const matches = getMatchingNames(nameAndPaths);

  if (matches.length > 0) {
    console.error(`ERROR: Found matching quickstart names`);
    console.error(`Punctuation and white space are removed before comparison`);
    matches.forEach((m) =>
      console.error(`${m.name} in ${removeRepoPathPrefix(m.path)}`)
    );
    console.error(`Please update your quickstart's name to be unique`);

    // `require.main` is equal to `module` when the file is being executed directly
    // if it isn't, the file is being import/required
    if (require.main === module) {
      process.exit(1);
    }
  } else {
    console.log(`All quickstart names are unique`);
  }
};

if (require.main === module) {
  main();
}

module.exports = main;
