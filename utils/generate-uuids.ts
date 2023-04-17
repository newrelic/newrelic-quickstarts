import * as fs from 'fs';

import { v4 as uuidv4 } from 'uuid';

import Quickstart from './lib/Quickstart';
import logger from './logger';

const main = (quickstarts: Quickstart[]): void => {
  for (const quickstart of quickstarts) {
    if (!quickstart.config.id) {
      logger.info(`Generating ID for ${quickstart.config.title}...`);

      const newId: string = uuidv4();
      const rawConfig: string = fs.readFileSync(
        quickstart.getConfigFilePath(),
        { encoding: 'utf8' }
      );
      const configWithId: string = `id: ${newId}\n${rawConfig}`;

      fs.writeFileSync(quickstart.getConfigFilePath(), configWithId, {
        encoding: 'utf8',
      });
      logger.info(`Generated ID for ${quickstart.config.title}`);
    }
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node generate-uuids.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  const quickstarts = Quickstart.getAll();

  main(quickstarts);
}
