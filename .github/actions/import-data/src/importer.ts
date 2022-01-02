import { dashboardBody, importedDashboardBody } from './types/dashboardInput';
import { GraphQLClient } from 'graphql-request';
import { addDashboard, checkIfDashboardExists, removeDashboard } from './mutations/dashboard';
import { addPolicy, checkIfPolicyExists, removePolicy } from './mutations/policy';
import { baselineMutation, staticMutation } from './mutations/alerts';
import * as yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
const prompts = require('prompts');

const url = 'https://api.newrelic.com/graphql';

const client = new GraphQLClient(url, {
	headers: { 'Content-Type': 'application/json' },
});

export const importer = async (accountId: number, nrApiKey: string, dashboardQuickstart: string): Promise<void> => {
	console.warn(
		'WARNING: The importer is for testing only and might change or be removed in the future. You can still use it today for testing, but it is not meant to be used in a production environment.',
	);
	if (!accountId && !nrApiKey && !dashboardQuickstart) {
		const args = yargs
			.options({
				accountId: {
					alias: 'id',
					demandOption: true,
					type: 'number',
					description: 'NR account id',
				},
				nrApiKey: {
					alias: 'key',
					demandOption: true,
					type: 'string',
					description: 'NR API Key',
				},
			})
			.example(
				'npm run import -- --id 0000000 --key NRAK-EXAMPLEVALUE11 mysql',
				'Import mysql package to account with id 0000000',
			).argv;

		if (args._.length < 1) {
			console.error(
				'Quickstart name is required. Example command: npm run import -- --id 0000000 --key NRAK-EXAMPLEVALUE11 mysql',
			);
			process.exit(0);
		}
		accountId = args.accountId;
		nrApiKey = args.nrApiKey;
		dashboardQuickstart = args._[0] as string;
	}
	client.setHeader('API-Key', nrApiKey);

	dashboardQuickstart = dashboardQuickstart.toLowerCase();

	const policyId = await createPolicy(accountId, dashboardQuickstart);

	await createDashboardLocal(accountId, dashboardQuickstart);
	await createAlertLocal(accountId, dashboardQuickstart, policyId);
};

const createPolicy = async (accountId: number, quickstart: string) => {
	const policyName = `${quickstart.charAt(0).toUpperCase() + quickstart.slice(1)} default alert policy`;
	let policyExists = await checkForExistingPolicy(policyName, accountId);

	if (policyExists.length > 0) {
		const response = await prompts({
			type: 'text',
			name: 'overwrite',
			message: `We've found ${policyExists.length} policies with "${policyName}" name, do you want to delete them? Yes/No`,
		});

		if (response.overwrite === 'Yes') {
			policyExists.forEach(async policyId => {
				await deletePolicy(policyId, accountId);
			});
		}
	}

	const variables = {
		accountId,
		name: policyName,
	};
	const response = await client.request(addPolicy, variables);
	return response.alertsPolicyCreate.id;
};

const createDashboardLocal = async (accountId: number, quickstart: string) => {
	const replacer = new RegExp('"accountId":0', 'g');

	const dir = `${__dirname}/../../../../quickstarts/${quickstart}/dashboards`;
	let importedFiles: importedDashboardBody[] = [];

	try {
		importedFiles = fs
			.readdirSync(dir)
			.filter(name => path.extname(name) === '.json')
			.map(name => require(path.join(dir, name)));
	} catch (error) {
		console.error(`Dashboard files for the name ${quickstart} not found. Did you provide the correct quickstart name?`);
	}

	importedFiles.forEach(async file => {
		let existingDashboards = await checkForExistingDashboards(file.name, accountId);

		if (existingDashboards.length > 0) {
			const response = await prompts({
				type: 'text',
				name: 'overwrite',
				message: `We've found ${existingDashboards.length} dashboards with "${file.name}" name, do you want to delete them? Yes/No`,
			});

			if (response.overwrite === 'Yes') {
				existingDashboards.forEach(async dashboardGuid => {
					await deleteDashboard(dashboardGuid);
				});
			}
		}

		file.permissions = 'PUBLIC_READ_WRITE';
		let stringifiedDashboard = JSON.stringify(file);
		stringifiedDashboard = stringifiedDashboard.replace(replacer, `"accountId": ${accountId}`);

		const parsedDashboard: dashboardBody = JSON.parse(stringifiedDashboard);

		const variables = {
			accountId,
			dashboard: parsedDashboard,
		};

		try {
			await client.request(addDashboard, variables);
		} catch (error) {
			console.error('Dashboard Failure: ', error.response.errors[0].message);
		}
	});
};

const createAlertLocal = async (accountId: number, quickstart: string, policyId: number) => {
	const variables = {
		accountId,
		condition: undefined,
		policyId,
	};

	const dir = `${__dirname}/../../../../quickstarts/${quickstart}/alerts`;
	let fileNames: string[] = [];

	try {
		fileNames = fs.readdirSync(dir).filter(name => path.extname(name) === '.yml');
	} catch (error) {
		console.error(`Alert files for the name ${quickstart} not found. Did you provide the correct quickstart name?`);
	}

	fileNames.forEach(async file => {
		const loadedYaml = yaml.loadAll(fs.readFileSync(`${dir}/${file}`, 'utf-8'));
		const parsedAlert = JSON.parse(JSON.stringify(loadedYaml))[0];

		if (parsedAlert.type === 'BASELINE') {
			const filledFile = transformData(parsedAlert);
			variables.condition = filledFile;

			try {
				await client.rawRequest(baselineMutation, variables);
			} catch (error) {
				console.error('Alert Failure: ', error.response.errors[0].message);
			}
		} else if (parsedAlert.type === 'STATIC') {
			const filledFile = transformData(parsedAlert);
			variables.condition = filledFile;

			try {
				await client.rawRequest(staticMutation, variables);
			} catch (error) {
				console.error('Alert Failure: ', error.response.errors[0].message);
			}
		}
	});
};

const transformData = (incomingFile: any) => {
	if (!incomingFile.enabled) {
		incomingFile.enabled = false;
	}

	if (incomingFile.type === 'BASELINE') {
		incomingFile.terms.forEach((term: { operator: string }) => {
			if (!term.operator) term.operator = 'ABOVE';
		});
	}

	if (incomingFile.type) {
		delete incomingFile.type;
	}

	if (incomingFile.details) {
		delete incomingFile.details;
	}

	return incomingFile;
};

const checkForExistingDashboards = async (name: string, accountId: number): Promise<Array<string>> => {
	let variables = {
		query: `type = 'DASHBOARD' and accountId = ${accountId}`,
		cursor: null,
	};

	const dashboardList: Array<string> = [];

	let response = await client.request(checkIfDashboardExists, variables);

	do {
		{
			variables.cursor = response.actor.entitySearch.results.nextCursor;
			response = await client.request(checkIfDashboardExists, variables);

			response.actor.entitySearch.results.entities.forEach((entity: any) => {
				if (entity.name.includes(name)) dashboardList.push(entity.guid);
			});
		}
	} while (response.actor.entitySearch.results.nextCursor !== null);

	return dashboardList;
};

const deleteDashboard = async (guid: string) => {
	const variable = {
		guid: guid,
	};
	await client.request(removeDashboard, variable);
};

const checkForExistingPolicy = async (policyName: string, accountId: number) => {
	let variables = {
		accountId: accountId,
		cursor: null,
	};

	const policyExists: Array<string> = [];

	let response = await client.request(checkIfPolicyExists, variables);

	do {
		{
			variables.cursor = response.actor.account.alerts.policiesSearch.nextCursor;
			response = await client.request(checkIfPolicyExists, variables);

			response.actor.account.alerts.policiesSearch.policies.forEach((policy: any) => {
				if (policy.name.includes(policyName)) policyExists.push(policy.id);
			});
		}
	} while (response.actor.account.alerts.policiesSearch.nextCursor !== null);

	return policyExists;
};

const deletePolicy = async (policyId: string, accountId: number) => {
	const variables = {
		accountId: accountId,
		id: policyId,
	};
	await client.request(removePolicy, variables);
};

export default importer;
