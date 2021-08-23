'use strict';
const fs = require('fs');

const { readPackFile, findMainPackConfigFiles } = require('./helpers');

/**
 * Method to validate icons and logos exist if supplied.
 * @returns {string[]} error messages for errors encountered
 */
const validateIconAndLogo = () => {
  const errorMessages = [];

  for (const configPath of findMainPackConfigFiles()) {
    var config = readPackFile(configPath);

    if ('icon' in config) {
      if (fs.existsSync(config.icon) === false) {
        errorMessages.push(
          `Icon for ${configPath} is supplied but does not exist at ${config.icon}`
        );
      }
    }

    if ('logo' in config) {
      if (fs.existsSync(config.logo) === false) {
        errorMessages.push(
          `Logo for ${configPath} is supplied but does not exist at ${config.logo}`
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
const handleErrors = (errorMessages) => {
  if (errorMessages.length === 0) {
    console.log('No errors found. Logo and icon validation passed.');
  }

  if (errorMessages.length > 0) {
    process.exitCode = 1; // fail the workflow

    for (const errorMessage in errorMessages) {
      console.log(errorMessage);
    }
  }
};

const main = () => {
  var errorMessages = validateIconAndLogo();
  handleErrors(errorMessages);
  console.log(''); // add an extra new line for more visual separation in the workflow
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_packs.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}

module.exports = { validateIconAndLogo, handleErrors };
