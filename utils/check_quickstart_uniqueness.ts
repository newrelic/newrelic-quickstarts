import type { QuickstartConfig } from './types/QuickstartConfig';
import type { FilePathAndContents } from './helpers';

import {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
} from './helpers';

export interface IdsAndPaths {
  id: QuickstartConfig['id'];
  path: string;
}

/**
 * Returns any quickstarts with matching ids
 * @param idsAndPaths - an array of objects containing the path and id of a quickstart
 * @returns - an array of matching values
 */
const getMatchingIds = (idsAndPaths: IdsAndPaths[]) => {
  return idsAndPaths.reduce((acc: IdsAndPaths[], { id, path }) => {
    const duplicates: IdsAndPaths[] = idsAndPaths.filter(
      (quickstart) =>
        quickstart.id && quickstart.id === id && quickstart.path !== path
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const main = (): void => {
  const configPaths: string[] = findMainQuickstartConfigFiles();
  const configs: FilePathAndContents<QuickstartConfig>[] = configPaths.map(
    (path: string) => readQuickstartFile<QuickstartConfig>(path)
  );

  const idsAndPaths: IdsAndPaths[] = configs.map(
    (c: FilePathAndContents<QuickstartConfig>) => ({
      id: c.contents[0].id,
      path: c.path,
    })
  );
  const idMatches: IdsAndPaths[] = getMatchingIds(idsAndPaths);

  if (idMatches.length == 0) {
    return console.log(`All quickstart ids are unique`);
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
