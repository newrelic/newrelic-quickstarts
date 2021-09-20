import * as core from '@actions/core';
import { importer } from './importer';

async function run(): Promise<void> {
	try {
		const accountId = core.getInput('nr-account-id') as unknown as number;
		const nrApiKey = core.getInput('nr-api-key');
		const quickstart = core.getInput('quickstart-to-import');

		importer(accountId, nrApiKey, quickstart);
	} catch (error) {
		core.setFailed(error.message);
	}
}

run();
