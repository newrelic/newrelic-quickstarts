'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const ajv = new Ajv();

// schemas
const mainConfigSchema = require('./schemas/main_config.json');
const alertSchema = require('./schemas/alert_config.json');
const dashboardSchema = require('./schemas/dashboard_config.json');
const flexConfigSchema = require('./schemas/flex_config.json');
const syntheticSchema = require('./schemas/synthetic_config.json');

/** 
* Method whichs reads contents at a file path, and validates contents against a schema. Errors are printed out to console.
* @param {String} filePath - Path of a file to read contents of and validate.
* @param {Object} schema - Json schema used for validation.
* @return {Object} Either a map containing { filePath : errors }, or undefined.
*/
const validateFile = (filePath, schema) => {
	const file = fs.readFileSync(filePath);
	const content = yaml.load(file);	
	const validate = ajv.compile(schema);
	const valid = validate(content);

	console.log(`Validating: ${filePath} . . .`);

	if (!valid) {
		const error = { [filePath] : validate.errors }; // this includes both the error, and path of file that errored
		return error;
	}
}

/** 
* Method which given a list of file paths, validates the contents of each file accordingly.
* @summary Method which given a list of filepaths, validates the contents of each file accordingly. Depending on the 'type' a file represents, a different schema is selected for validation.
* @param {String[]} filePaths - Array of file paths, whose file contents will be validated.
* @return {Void}
*/
const validateFiles = (filePaths) => {
	const errors = []

	for (const filePath of filePaths){
		let schema;
		
		switch(true){
			case(filePath.includes('/alerts/')): // validate using alert schema
				schema = alertSchema;
				break;
			case(filePath.includes('/dashboards/')): // validate using dashboard schema
				schema = dashboardSchema;
				break;
			case(filePath.includes('/synthetics/')): // validate using synthetics schema
				schema = syntheticSchema;
				break;
			case(filePath.includes('/flex_configs/')): // validate using flex config schema. TODO: update directory structure
				schema = flexConfigSchema;
				break;
			default: // use main config schema
				schema = mainConfigSchema;
				break;
		}

		let output = validateFile(filePath, schema);
		if(output != undefined){
			errors.push(output);
		}
	}

	if (errors.length > 0){
		console.log(`Errors found.`);
		console.log(JSON.stringify(errors, null, 4));
		process.exit(1);
	}
}

const getConfigFile = (packDir) => {
	const configPath = path.resolve(process.cwd(), packDir, 'config.yml');
	console.log('PATH', configPath);
	const file = fs.readFileSync(configPath);
	const configContent = yaml.load(file);

	return configContent;
}

/** 
* Method which takes in all files, and filters to only the ones we care about.
* @param {String[]} changedFilePaths - Array of filePaths containing all files that have been changed.
* @return {String[]} Array of filePaths containing only the relevant changed files.
*/
const getChangedFiles = (changedFilePaths) => {
	const relevantChangedFiles = changedFilePaths
		.filter(filePath => ['.yml', 'yaml'].includes(path.extname(filePath))) // only yaml files
		.filter(filePath => !path.dirname(filePath).includes('.github')); // ignore files in .github folder

	return relevantChangedFiles;
}

const main = () => {
	/* Pseudo code
	1. Read in changed files from input.
	2. Filter out irrelevant files.
		validate only yaml files
		dont validate internal files, etc. so nothing in .github.
	3. For each relevant file, validate it.
	4. Print out result for each file as it validates.
	*/

	const changedFiles = getChangedFiles(process.argv.slice(2));
	console.log(`Running against: ${JSON.stringify(changedFiles, null, 4)}`);
	validateFiles(changedFiles);
}

main();

// const contents = getConfigFile('mysql');
// validateFile(contents, mainConfigSchema);
