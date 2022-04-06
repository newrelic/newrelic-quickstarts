import * as path from 'path';

import type { QuickstartConfig, YamlFile } from './check-quickstart-slug';
import { findMainQuickstartConfigFiles, readYamlFile } from './helpers';

import { iterateQuickstarts } from './check-quickstart-slug';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

const fixConfig = (
  rawConfig: string,
  pattern: string,
  replacement: string
): string => {
  return rawConfig.replace(pattern, replacement);
};

const fixQuickstarts = (
  failedQuickstarts: Array<string>
): Promise<Boolean[]> => {
  const fixedQuickstarts = failedQuickstarts.map(async (quickstartPath) => {
    // read config yaml file
    const yaml: YamlFile = readYamlFile(
      path.join(process.cwd(), `../${quickstartPath}`)
    ) as YamlFile;

    // grab the contents of the config
    const config: QuickstartConfig = yaml.contents[0];

    try {
      const filePath = path.resolve('..', quickstartPath);

      // get the raw config from readFileSync
      const rawConfig = readFileSync(filePath, { encoding: 'utf8' });

      // replace name with title
      const fixedConfig = fixConfig(rawConfig, 'name:', 'slug:');

      // write to file
      const writePromise = writeFile(filePath, fixedConfig);
      await writePromise;

      return true;
    } catch (error) {
      console.log(
        `Quickstart "${config.title}" has not been updated:\n`,
        error
      );
      return false;
    }
  });
  return Promise.all(fixedQuickstarts);
};

const main = () => {
  const diffs: Array<[string, QuickstartConfig]> = [];
  const similars: Array<[string, QuickstartConfig]> = [];

  const filePaths = findMainQuickstartConfigFiles();

  iterateQuickstarts(filePaths, diffs, similars);

  const allQuickstarts = [...diffs, ...similars].map(
    (pathConfigPair) => pathConfigPair[0] // just the path
  );

  fixQuickstarts(allQuickstarts);
};

if (require.main === module) main();
