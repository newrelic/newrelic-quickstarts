import 'dotenv/config';
import { input, password, confirm, select } from '@inquirer/prompts';
import { appendFileSync } from 'node:fs';
import { createValidateQuickstarts } from './create_validate_pr_quickstarts';
import { createValidateDataSources } from './create-validate-data-sources';
import { generatePrUrl } from './lib/github-api-helpers';
import { setDashboardsRequiredDataSources } from './set-dashboards-required-datasources';
import { setAlertPoliciesRequiredDataSources } from './set-alert-policy-required-datasources';

type Environment = 'local' | 'staging' | 'us' | 'eu';
type Context = {
  ENVIRONMENT: Environment;
  GH_TOKEN: string;
  NR_API_TOKEN: string;
  PR_NUMBER: string | number;
  PR_URL: string;
  API_ENDPOINT: string;
};

const API_ENDPOINTS: Record<Environment, string> = {
  local: 'https://localhost.newrelic.com:3100/graphql',
  staging: 'https://staging-api.newrelic.com/graphql',
  us: 'https://api.newrelic.com/graphql',
  eu: 'https://api.eu.newrelic.com/graphql',
};

const divider = () => console.log('―――――――――――――――――――――――――――――');
const stepMessage = (message: string) => {
  divider();
  console.log(message);
  divider();
};

const bootstrap = async (): Promise<Context> => {
  const ENVIRONMENT = await select<Environment>({
    message: 'Select an environment to target.',
    choices: [
      { name: 'Local', value: 'local' },
      { name: 'Staging', value: 'staging' },
      { name: 'US Production', value: 'us' },
      { name: 'EU Production', value: 'eu' },
    ],
  });

  let GH_TOKEN = process.env.GH_TOKEN;
  let NR_API_TOKEN = process.env[`NR_API_TOKEN_${ENVIRONMENT.toUpperCase()}`];

  if (ENVIRONMENT === 'local') {
    // Local env should use staging API token
    NR_API_TOKEN = process.env['NR_API_TOKEN_STAGING'];
    // Allow self-signed certs against localhost
    process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
  }

  if (!NR_API_TOKEN) {
    stepMessage(`No API key found for ${ENVIRONMENT}.`);
    NR_API_TOKEN = await password({
      message: `What is your NR API key for ${ENVIRONMENT}?`,
    });

    appendFileSync(
      '.env',
      `\nNR_API_TOKEN_${ENVIRONMENT.toUpperCase()}=${NR_API_TOKEN}`
    );
    console.log(
      `Your NR API key for ${ENVIRONMENT} has been saved to the .env file. Do not commit this file.`
    );
  }

  if (!GH_TOKEN) {
    stepMessage(
      "No GitHub token found. You may experience rate-limiting from the GitHub API if you don't enter one."
    );
    GH_TOKEN = await password({
      message: 'What is your GitHub token? (optional)',
    });

    if (GH_TOKEN?.length) {
      appendFileSync('.env', `\nGH_TOKEN=${GH_TOKEN}`);
      console.log(
        'Your GitHub token has been saved to the .env file. Do not commit this file.'
      );
    }
  }

  divider();
  const PR_NUMBER = await input({
    message:
      'What is the PR number for the merge of the release branch into main?',
  });
  divider();

  const PR_URL = generatePrUrl(PR_NUMBER);

  // Set required env vars that can't be passed into function calls
  process.env.NR_API_URL = API_ENDPOINTS[ENVIRONMENT];
  process.env.NR_API_TOKEN = NR_API_TOKEN;

  return {
    ENVIRONMENT,
    GH_TOKEN: GH_TOKEN ?? '',
    NR_API_TOKEN: NR_API_TOKEN!,
    PR_NUMBER,
    PR_URL,
    API_ENDPOINT: API_ENDPOINTS[ENVIRONMENT],
  };
};

const main = async () => {
  const { ENVIRONMENT, GH_TOKEN, PR_URL } = await bootstrap();

  stepMessage(`Performing dry run release to ${ENVIRONMENT}...`);

  // Dry run
  await runTasks(PR_URL, GH_TOKEN, true);

  const shouldContinue = await confirm({
    message: 'Dry run was successful. Proceed to deploy?',
  });

  if (shouldContinue) {
    stepMessage(`🚀 Releasing to ${ENVIRONMENT}!`);
    // Real deploy
    runTasks(PR_URL, GH_TOKEN, false);
  } else {
    console.log('Aborting.');
    process.exit(0);
  }
};

const runTasks = async (url: string, token: string, dryRun = true) => {
  await createValidateDataSources(url, token, dryRun);
  await createValidateQuickstarts(url, token, dryRun);

  if (!dryRun) {
    await setDashboardsRequiredDataSources(url, token);
    await setAlertPoliciesRequiredDataSources(url, token);
  }
};

if (require.main === module) {
  main();
}
