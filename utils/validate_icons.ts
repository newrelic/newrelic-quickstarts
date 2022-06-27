const fs = require('fs');
const path = require('path');

const {
  readQuickstartFile,
  findMainQuickstartConfigFiles,
} = require('./helpers');

/**
 * Method to validate icons exist if supplied.
 * @param {string[]} mainConfigPaths array of absolute paths for each main config
 * @returns {string[]} error messages for errors encountered
 */
export const validateIcon = (
    mainConfigPaths: string[]
  ): string[] => {
  const errorMessages = [];

  for (const configPath of mainConfigPaths) {
    const {
      contents: [config],
    } = readQuickstartFile(configPath);

    if ('icon' in config) {
      const iconPath: string = path.join(path.dirname(configPath), config.icon);
      if (fs.existsSync(iconPath) === false) {
        errorMessages.push(
          `Icon for ${configPath} is supplied but does not exist at ${iconPath}`
        );
      }
    }
  }

  return errorMessages;
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
  var mainConfigPaths: string[] = findMainQuickstartConfigFiles();
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
