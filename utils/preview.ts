import * as express from 'express';

// Types
import { Request, Response } from 'express';

// Modules
import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

// App
const app = express();
const port: number = 3000;

const QUICKSTART_PATH: string = process.argv[2];

/*
  Validates that the directory path provided exists
*/
fs.access(`../quickstarts/${QUICKSTART_PATH}`, (error: any) => {
  if (error) {
    throw new Error(`Path: ${QUICKSTART_PATH} does not exist.`);
  }
});

app.use(express.static(path.join(path.resolve(__dirname, '..'), `/quickstarts/${QUICKSTART_PATH}`)));

app.get('/', (req: Request, res: Response) => {
  const response = glob.sync(path.join(path.resolve(__dirname, '..'), `/quickstarts/${QUICKSTART_PATH}/**/*.*`));
  
  res.send(response);
});

app.listen(port, () => {
  console.log("\x1b[32m", `Use this to get a list of your files! http://localhost:3000`);
});
