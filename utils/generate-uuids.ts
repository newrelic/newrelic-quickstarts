'use strict';

const fs = require('fs');
const { v4: uuidv4 } = require('uuid');
import { findMainQuickstartConfigFiles, readYamlFile } from "./helpers";

import { QuickstartConfig } from './types/QuickstartConfig';

/**
 * Checks for and generates UUIDs for quickstarts
 * @param {String[]} paths an array of quickstarts config paths
 **/
const main = (paths: string[]): void => {
  for (const path of paths) {
    const config: QuickstartConfig = readYamlFile<QuickstartConfig>(path).contents[0];

    if (config && !('id' in config)) {
      const newId: string = uuidv4();
      const rawConfig: string = fs.readFileSync(path, { encoding: 'utf8' });
      const configWithId: string = `id: ${newId}\n${rawConfig}`;

      fs.writeFileSync(path, configWithId, { encoding: 'utf8' });
    }
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node generate-uuids.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  const configPaths: string[] = findMainQuickstartConfigFiles();
  
  main(configPaths);
}
