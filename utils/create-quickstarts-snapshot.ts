// To run (from the `utils/` directory):
// npx ts-node create-quickstarts-snapshot.ts

import * as fs from 'fs';
import * as path from 'path';
import {
  FilePathAndContents,
  findMainQuickstartConfigFiles,
  readQuickstartFile,
} from './helpers';
import { buildMutationVariables } from './create_validate_pr_quickstarts';
import { QuickstartConfig } from './types/QuickstartConfig';
import { QuickstartMutationVariable } from './types/QuickstartMutationVariable';

type QuickstartFileAndConfig = FilePathAndContents<QuickstartConfig>;

/**
 * Saves a JSON file for a quickstart, given the GraphQL Mutation variables.
 * Files are saved in a top-level `snapshots/` directory.
 *
 * @example snapshots/battlesnake-12345.json
 *
 * @param variable - GraphQL Mutation variable for a quickstart
 */
const saveQuickstartMutationVariable = (
  variable: QuickstartMutationVariable
) => {
  const { id, quickstartMetadata } = variable;
  const { slug } = quickstartMetadata;

  const filename = `${slug}-${id}.json`;
  const filepath = path.join(__dirname, '..', 'snapshots', filename);

  fs.writeFileSync(filepath, JSON.stringify(quickstartMetadata, null, 2));
};

const main = () => {
  // get all quickstart config.yml filepaths
  const quickstartConfigFiles = findMainQuickstartConfigFiles();

  // convert all the config filepaths to objects
  const quickstartConfigs =
    quickstartConfigFiles.map<QuickstartFileAndConfig>(readQuickstartFile);

  // build the GraphQL API variables for each quickstart
  const quickstartMutationVariables = quickstartConfigs.map(
    buildMutationVariables
  );

  // save the variables as a JSON file in the `/snapshots` directory
  quickstartMutationVariables.forEach(saveQuickstartMutationVariable);
};

main();
