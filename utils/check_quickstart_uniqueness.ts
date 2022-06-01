import {
  readQuickstartFile,
  removeRepoPathPrefix,
  findMainQuickstartConfigFiles,
} from './helpers';

import { QuickstartConfig } from "./types/QuickstartConfig";
import { FilePathAndContents } from "./helpers";

export type IdsAndPaths = {
  id: string;
  path: string;
};

/**
 * Returns any quickstarts with matching ids
 */
const getMatchingIds = (
    idsAndPaths: IdsAndPaths[]
  ): IdsAndPaths[] => {
  return idsAndPaths.reduce((acc:IdsAndPaths[], { id, path }:IdsAndPaths) => {
    const duplicates = idsAndPaths.filter(
      (quickstart: IdsAndPaths) =>
        quickstart.id && quickstart.id === id && quickstart.path !== path
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const main = (): void => {
  const configPaths: string[] = findMainQuickstartConfigFiles();
  const configs: FilePathAndContents<QuickstartConfig>[] = configPaths.map((path) => readQuickstartFile<QuickstartConfig>(path));
  
  const idsAndPaths = configs.map((c: FilePathAndContents<QuickstartConfig>) => ({
    id: c.contents[0].id,
    path: c.path,
  }));
  const idMatches: IdsAndPaths[] = getMatchingIds(idsAndPaths);

  if (idMatches.length == 0) {
    return console.log(`All quickstart ids are unique`);
  }

  if (idMatches.length > 0) {
    console.error(`ERROR: Found matching ids`);
    console.error(
      `An id should not be set by the user, these are auto-generated`
    );
    idMatches.forEach((m:IdsAndPaths) =>
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

export default main;