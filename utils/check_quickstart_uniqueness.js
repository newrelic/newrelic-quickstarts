'use strict';
const {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
  getMatchingNames,
  cleanQuickstartName,
} = require('./helpers');

/**
 * Returns any quickstarts with matching ids
 * @param {Object[]} idsAndPaths an array of objects containing the path and id of a quickstart
 * @returns {Object[]} an array of matching values
 */
const getMatchingIds = (idsAndPaths) => {
  return idsAndPaths.reduce((acc, { id, path }) => {
    const duplicates = idsAndPaths.filter(
      (quickstart) =>
        quickstart.id && quickstart.id === id && quickstart.path !== path
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
  const idsAndPaths = configs.map((c) => ({
    id: c.contents[0].id,
    path: c.path,
  }));
  const nameMatches = getMatchingNames(nameAndPaths);
  const idMatches = getMatchingIds(idsAndPaths);

  if (nameMatches.length == 0 && idMatches.length == 0) {
    return console.log(`All quickstart names and ids are unique`);
  }

  if (nameMatches.length > 0) {
    console.error(`ERROR: Found matching quickstart names`);
    console.error(`Punctuation and white space are removed before comparison`);
    nameMatches.forEach((m) =>
      console.error(`${m.name} in ${removeRepoPathPrefix(m.path)}`)
    );
    console.error(`Please update your quickstart's name to be unique\n`);
  }

  if (idMatches.length > 0) {
    console.error(`ERROR: Found matching ids`);
    console.error(
      `An id should not be set by the user, these are auto-generated`
    );
    idMatches.forEach((m) =>
      console.error(`${m.id} in ${removeRepoPathPrefix(m.path)}`)
    );
    console.error(
      `Please remove your quickstart's id and we will auto-generate it\n`
    );
  }
  if (require.main === module) {
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = main;
