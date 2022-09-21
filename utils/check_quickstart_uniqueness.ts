import Quickstart from './lib/Quickstart';

export type IdsAndPaths = {
  id: string;
  configPath: string;
};

/**
 * Returns any quickstarts with matching ids
 */
const getMatchingIds = (
    idsAndPaths: IdsAndPaths[]
  ): IdsAndPaths[] => {
  return idsAndPaths.reduce((acc:IdsAndPaths[], { id, configPath }:IdsAndPaths) => {
    const duplicates = idsAndPaths.filter(
      (quickstart: IdsAndPaths) =>
        quickstart.id &&
        quickstart.id === id &&
        quickstart.configPath !== configPath
    );

    return [...new Set([...acc, ...duplicates])];
  }, []);
};

const main = (): void => {
  const quickstarts = Quickstart.getAll();
  const IdsAndPaths = quickstarts.map(({ config: { id }, configPath }) => ({
    id,
    configPath,
  }));
  const idMatches: IdsAndPaths[] = getMatchingIds(IdsAndPaths);

  if (idMatches.length == 0) {
    return console.log(`All quickstart ids are unique`);
  }

  if (idMatches.length > 0) {
    console.error(`ERROR: Found matching ids`);
    console.error(
      `An id should not be set by the user, these are auto-generated`
    );
    idMatches.forEach((m:IdsAndPaths) =>
      console.error(`${m.id} in quickstarts/${m.configPath}`)
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
