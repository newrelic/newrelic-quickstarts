import * as express from 'express';
import * as path from 'path';
import * as cors from 'cors';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

// Types
import { Request, Response } from 'express';

import Quickstart from './lib/Quickstart';
import { QuickstartConfig } from './types/QuickstartConfig';

const GREEN = '\x1b[32m';
const PORT = process.env.PORT || '3000';
const PARENT_DIRECTORY = path.resolve(__dirname, '../quickstarts');
const DASHBOARDS_DIRECTORY = path.resolve(__dirname, '../dashboards');
const ALERTS_DIRECTORY = path.resolve(__dirname, '../alert-policies');
const BASE_PREVIEW_LINK =
  'https://newrelic.com/instant-observability/preview?local=true';

const app = express();

/**
 * Helper function to ensure that an identifier has been supplied
 * and that it is for a valid quickstart.
 */
const validateArgs = (identifier: string, configFile: string) => {
  if (!identifier) {
    console.error(
      'You must provide a directory path to the quickstart. Example: yarn preview aws/amazon-athena'
    );
    process.exit(1);
  }

  const quickstart = new Quickstart(
    `${identifier}/${configFile}`,
    path.resolve(PARENT_DIRECTORY)
  );

  if (!quickstart.isValid) {
    console.error(
      `\n*** Could not find a config.yml or config.yaml for ${identifier}***\n`
    );
    process.exit(1);
  }
};

/**
 * Helper function to generate a preview link with an identifier
 * and an optional port.
 */
const getPreviewLink = (identifier: string) => {
  const port = PORT !== '3000' ? `&port=${PORT}` : '';
  return `${BASE_PREVIEW_LINK}&quickstart=${identifier}${port}`;
};

/**
 * Takes an absolute path and removes everything prior to and including 'newrelic-quickstarts'
 * @returns file paths starting at quickstarts/ | dashboards/ | alert-policies/ Example: dashboards/battlesnake-game-tracking/battlesnake-game-tracking.json
 */
const removePathPrefixes = (filePath: string) =>
  filePath.split('/newrelic-quickstarts/')[1];

/**
 * Takes a string array of directories (dashboards for a quickstart) and base directory (dashboards | alert-policies) and returns all the files from the directories in a flat map
 */
const getFilesFromDirectories = (directories: string[], rootDir: string) =>
  directories.flatMap((dir) =>
    glob.sync(path.join(rootDir, `${dir}/*.*`)).map(removePathPrefixes)
  );
/**
 * Entrypoint.
 */
const main = async () => {
  const identifier = process.argv[2];
  const configPath =
    glob.sync(path.join(PARENT_DIRECTORY, identifier, 'config.*'))[0] ?? '';
  const configFile = configPath.split('/').pop() ?? '';

  validateArgs(identifier, configFile);

  const link = getPreviewLink(identifier);

  app.use(
    cors({
      origin: '*',
    })
  );
  app.use('/', express.static(path.resolve(__dirname, '..')));

  app.get('/', (req: Request, res: Response) => {
    const quickstartFiles = glob
      .sync(path.join(PARENT_DIRECTORY, `/${identifier}/**/*.*`))
      .map(removePathPrefixes);

    const config = yaml.load(
      fs.readFileSync(configPath).toString('utf-8')
    ) as QuickstartConfig;

    const dashboardFiles = getFilesFromDirectories(
      config.dashboards || [],
      DASHBOARDS_DIRECTORY
    );
    const alertPolicyFiles = getFilesFromDirectories(
      config.alertPolicies || [],
      ALERTS_DIRECTORY
    );

    res.json([...quickstartFiles, ...dashboardFiles, ...alertPolicyFiles]);
  });

  app.listen(PORT, () => {
    console.log(`Now serving files on http://localhost:${PORT}`);
    console.log(`${GREEN}You can view your preview at ${link}`);
  });
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
