'use strict';
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');
const Ajv = require('ajv');
const ajv = new Ajv();

const mainConfigSchema = require('./schemas/main_config.json');

// const configTestPath = '/Users/aswanson/dev/newrelic-observability-packs/mysql/config.yml';

const validateFile = (file, schema) => {
	const validate = ajv.compile(schema);
	const valid = validate(file);

	if (!valid) {
		console.log(validate.errors);
	}
}

const getConfigFile = (packDir) => {
	const configPath = path.resolve(process.cwd(), packDir, 'config.yml');
	console.log('PATH', configPath);
	const file = fs.readFileSync(configPath);
	const configContent = yaml.load(file);

	return configContent;
}

const contents = getConfigFile('mysql');
validateFile(contents, mainConfigSchema);
