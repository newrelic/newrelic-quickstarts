import * as express from 'express';

// Types
import { Request, Response } from 'express';

// Modules
import * as path from 'path';
import * as glob from 'glob';
import * as cors from 'cors';

// Helpers
import { removeRepoPathPrefix } from './lib/helpers';

// App
const app = express();

const port: string = process.env.PORT || '3000';
const QUICKSTART_DIRECTORY: string = process.argv[2];
const PARENT_DIRECTORY: string = path.resolve(__dirname, '../quickstarts');

/**
 * Async function to validate given path is to a single quickstart
 * @param parentDirectory - Quickstart home directory 
 * @param quickstartDirectory - Quickstart directory
*/
export const isPathValid = (parentDirectory: string, quickstartDirectory: string): boolean => {
  const configFile = glob.sync(path.join(parentDirectory, `/${quickstartDirectory}/config.+(yml|yaml)`));
  const fullPath = path.join(parentDirectory, `/${quickstartDirectory}`);

  if (!configFile || configFile.length !== 1) {
    console.error(`Could not find a config.yml or config.yaml at ${fullPath}.`);
    return false;
  }

  return true;
};

const main = async () => {
    // Validate whether param was provided
  if (!process.argv[2]) {
    console.error("You must provide a directory path to the quickstart. Example: yarn preview aws/amazon-athena");
    process.exit(1);
  }

  /*
        Set to localhost for dev purposes TODO: Set to instant observability later
  */
  let PREVIEW_LINK = 'https://newrelic.com/instant-observability/preview?local=true';

  if (port !== '3000') {
    PREVIEW_LINK += `&port=${port}`;
  }

  const isValid = isPathValid(PARENT_DIRECTORY, QUICKSTART_DIRECTORY);

  if (!isValid) {
    process.exit(1);
  }

  app.use(cors({
    origin: '*'
  }));
  app.use(`/quickstarts/${QUICKSTART_DIRECTORY}`, express.static(path.join(PARENT_DIRECTORY, `/${QUICKSTART_DIRECTORY}`)));

  app.get('/', (req: Request, res: Response) => {
    let response = glob.sync(path.join(PARENT_DIRECTORY, `/${QUICKSTART_DIRECTORY}/**/*.*`))
                      
    res.json(response.map(removeRepoPathPrefix));
  });

  app.listen(port, () => {

    /*
        Set to localhost for dev purposes TODO: Set to instant observability later
    */
    console.log("\x1b[32m", `Now serving your output on: http://localhost:${port} \n You can view your preview at: ${PREVIEW_LINK}`);
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
