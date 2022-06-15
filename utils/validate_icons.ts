import * as fs from 'fs';
import * as path from 'path';
import Quickstart from './lib/Quickstart';

/**
 * Method to validate icons exist if supplied.
 * @param {string[]} quickstarts array of absolute paths for each main config
 * @returns {string[]} error messages for errors encountered
 */
export const validateIcon = (
    quickstarts: Quickstart[]
  ): string[] => {

  const errorMessages = quickstarts.map((quickstart) => {
    if (quickstart.config.icon) {
      const configPath = path.dirname(quickstart.getConfigFilePath());
      const iconPath = path.join(configPath, quickstart.config.icon);

      if (!fs.existsSync(iconPath)) {
        return `Icon for ${configPath} is supplied but does not exist at ${iconPath}`;
      }
      else {
        // empty string to be filtered out
        return '' 
      }
    }
    else {
      return `No icon found for ${quickstart.config.title}`;
    }
  });

  return errorMessages.filter(Boolean);
};

/**
 * Method to handle the processing / next steps after we have found errors.
 * @param {string[]} errorMessages
 */
export const handleErrors = (
    errorMessages: string[]
  ): void => {
  if (errorMessages.length === 0) {
    console.log('No errors found. Icon validation passed.');
  }

  if (errorMessages.length > 0) {
    process.exitCode = 1; // fail the workflow

    for (const errorMessage of errorMessages) {
      console.log(errorMessage);
    }
  }
};

const main = () => {
  console.log(''); // add an extra new line for more visual separation in the workflow
  var mainConfigPaths = Quickstart.getAll()
  var errorMessages: string[] = validateIcon(mainConfigPaths);
  handleErrors(errorMessages);
  console.log(''); // add an extra new line for more visual separation in the workflow
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_icons.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
