// To run (from the `utils/` directory):
// npx ts-node create-quickstarts-snapshot.ts

import * as fs from 'fs';
import * as path from 'path';
import { QuickstartMutationVariable } from './types/QuickstartMutationVariable';
import Quickstart from './lib/Quickstart';

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
  const quickstarts = Quickstart.getAll();

  const quickstartMutationVariables = quickstarts.map((qs) =>
    qs.getMutationVariables(true)
  );

  // save the variables as a JSON file in the `/snapshots` directory
  quickstartMutationVariables.forEach(saveQuickstartMutationVariable);
};

main();
