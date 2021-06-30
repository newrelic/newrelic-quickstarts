'use strict';
const path = require('path');
const glob = require('glob');
const Ajv = require('ajv');
const { ErrorObject } = require('ajv');
const ajv = new Ajv({ allErrors: true });

const { readPackFile, removeRepoPathPrefix } = require('./helpers');

// schemas
const mainConfigSchema = require('./schemas/main_config.json');
const alertSchema = require('./schemas/alert_config.json');
const dashboardSchema = require('./schemas/dashboard_config.json');
const flexConfigSchema = require('./schemas/flex_config.json');
const flexIntegrationsSchema = require('./schemas/flex_integrations.json');
const syntheticSchema = require('./schemas/synthetic_config.json');
const loggingSchema = require('./schemas/logging_config.json');

const EXCLUDED_DIRECTORY_PATTERNS = [
  'node_modules/**',
  'utils/**',
  'docs/**',
  '*',
];

/**
 * Converts errors generated from ajv into 'general errors' we want to display to the user.
 * @param {ErrorObject[]} ajvErrors - Errors generated from ajv validation.
 * @return {Object[]} Array of our own internal error objects.
 */
const convertErrors = (ajvErrors) => {
  const errors = ajvErrors.map((e) => {
    let message = '';
    switch (true) {
      case e.keyword === 'enum':
        message = `'${e.instancePath}' ${e.message}: ${JSON.stringify(
          e.params.allowedValues
        )}`;
        return { message };
      case e.keyword === 'required' && e.instancePath != '':
        message = `'${e.instancePath}' ${e.message}`;
        return { message };
      default:
        return { message: e.message };
    }
  });

  return errors;
};

/**
 * Validates an object against a JSON schema
 * @param {Object} content - The object to validate
 * @param {Object} schema - Json schema used for validation.
 * @returns {Object[]} An array of any errors found
 */
const validateAgainstSchema = (content, schema) => {
  const validate = ajv.compile(schema);
  const valid = validate(content);

  if (!valid) {
    return convertErrors(validate.errors);
  }

  return [];
};

/**
 * Validates a files contents against the appropriate schema
 * @param {Object} file - an object containing the path and contents of a file
 * @returns {Object} the same file object with an array of `errors`
 */
const validateFile = (file) => {
  const filePath = file.path;
  let errors = [];

  console.log(`Validating ${removeRepoPathPrefix(filePath)}`);
  switch (true) {
    case filePath.includes('/alerts/'): // validate using alert schema
      errors = validateAgainstSchema(file.contents[0], alertSchema);
      break;
    case filePath.includes('/dashboards/'): // validate using dashboard schema
      errors = validateAgainstSchema(file.contents[0], dashboardSchema);
      break;
    case filePath.includes('/instrumentation/synthetics/'): // validate using synthetics schema
      errors = validateAgainstSchema(file.contents[0], syntheticSchema);
      break;
    case(filePath.includes('/instrumentation/logging/')): // validate using logging schema
      errors = validateAgainstSchema(file.contents[0], loggingSchema);
      break;
    case(filePath.includes('/instrumentation/flex/')): // validate using flex config schema. 
      // The flex YAML is two documents, validate each of them
      errors = [
        ...validateAgainstSchema(file.contents[0], flexConfigSchema),
        ...validateAgainstSchema(file.contents[1], flexIntegrationsSchema),
      ];
      break;
    default:
      // use main config schema
      errors = validateAgainstSchema(file.contents[0], mainConfigSchema);
      break;
  }

  return { ...file, errors };
};

/**
 * Globs YAML and JSON files to be validated
 * @param {String} basePath - the base path to search under, usually the current working directory
 * @returns {String[]} An array containing the file paths
 */
const getPackFilePaths = (basePath) => {
  const options = {
    ignore: EXCLUDED_DIRECTORY_PATTERNS.map((d) => path.resolve(basePath, d)),
  };

  const yamlFilePaths = [
    ...glob.sync(path.resolve(basePath, '../packs/**/*.yaml'), options),
    ...glob.sync(path.resolve(basePath, '../packs/**/*.yml'), options),
  ];

  const jsonFilePaths = glob.sync(
    path.resolve(basePath, '../packs/**/*.json'),
    options
  );

  return [...yamlFilePaths, ...jsonFilePaths];
};

/**
 * Format and print out errors for a list of files.
 * @param {Object[]} filesWithErrors - each element is an object containing a path, and errors associated with that path.
 */
const printErrors = (filesWithErrors) => {
  for (const f of filesWithErrors) {
    let outputMessage = `\nError: ${removeRepoPathPrefix(f.path)}`;
    for (const e of f.errors) {
      outputMessage += `\n\t ${e.message}`;
    }
    console.log(outputMessage);
  }
  console.log('');
};

const main = () => {
  const filePaths = getPackFilePaths(process.cwd()).sort();
  const files = filePaths.map(readPackFile);

  const filesWithErrors = files
    .map(validateFile)
    .filter((file) => file.errors.length > 0);

  printErrors(filesWithErrors);

  if (filesWithErrors.length > 0) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_packs.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}

module.exports = { validateFile, convertErrors, printErrors };
