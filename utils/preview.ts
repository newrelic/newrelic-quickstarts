import * as express from 'express';

// Types
import { Request, Response } from 'express';

// Modules
import * as path from 'path';
import * as glob from 'glob';
import * as cors from 'cors';

// App
const app = express();

const port: string = process.env.PORT || '3000';
const QUICKSTART_DIRECTORY: string = process.argv[2];
const PARENT_DIRECTORY: string = path.resolve(__dirname, '..');

/*
    Validates that the directory path provided exists
*/
const validatePath = async (quickstartDirectory: string) => {
  const configFile = glob.sync(path.join(PARENT_DIRECTORY, `/quickstarts/${quickstartDirectory}/config.+(yml|yaml)`));
  const fullPath = path.join(PARENT_DIRECTORY, `/quickstarts/${quickstartDirectory}`);
  
  if (!configFile || configFile.length !== 1) {
    console.error(`Could not find a config.yml or config.yaml at ${fullPath}.`);
    process.exit(1);
  }
};

const removePathPrefixes = (paths: string[]) => {
  return paths.map(filePath => filePath.slice(filePath.indexOf('/quickstarts')).slice(1));
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

  await validatePath(QUICKSTART_DIRECTORY);

  app.use(cors({
    origin: '*'
  }));
  app.use(`/quickstarts/${QUICKSTART_DIRECTORY}`, express.static(path.join(PARENT_DIRECTORY, `/quickstarts/${QUICKSTART_DIRECTORY}`)));

  app.get('/', (req: Request, res: Response) => {
    let response = glob.sync(path.join(PARENT_DIRECTORY, `/quickstarts/${QUICKSTART_DIRECTORY}/**/*.*`))
                      
    response = removePathPrefixes(response);                  

    res.json(response);
  });

  app.listen(port, () => {

    /*
        Set to localhost for dev purposes TODO: Set to instant observability later
    */
    console.log("\x1b[32m", `Now serving your output on: http://localhost:${port} \n You can view your preview at: ${PREVIEW_LINK}`);
  });
};

main();
