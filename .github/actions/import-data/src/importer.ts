import { dashboardBody, importedDashboardBody } from './types/dashboardInput';
import { AlertsUnion } from './types/alertsNrqlCondition';
import { GraphQLClient } from 'graphql-request';
import addDashboard from './mutations/dashboard';
import addPolicy from './mutations/policy';
import { baselineMutation, outlierMutation, staticMutation } from './mutations/alerts';
import * as yargs from 'yargs';
import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';


const url = 'https://api.newrelic.com/graphql';

const client = new GraphQLClient(url, {
    headers: {'Content-Type': 'application/json'}
});

export const importer = async (
  accountId: number,
  nrApiKey: string,
  dashboardPack: string
): Promise<void> => {
  let usingActions = true;
  if (!accountId && !nrApiKey && !dashboardPack) {
    const args = yargs.options({
      accountId: {
        alias: 'id',
        demandOption: true,
        type: 'number',
        description: 'NR account id'
      },
      nrApiKey: {
        alias: 'key',
        demandOption: true,
        type: 'string',
        description: 'NR API Key'
      },
      dashboardPack: {
        alias: 'pack',
        demandOption: true,
        type: 'string',
        description: 'NR API Key'
      }
    }).argv

    accountId = args.accountId
    nrApiKey = args.nrApiKey
    dashboardPack = args.dashboardPack

    usingActions = false;
  };
  client.setHeader('API-Key', nrApiKey);

  dashboardPack = dashboardPack.toLowerCase();
  const policyId = await createPolicy(accountId, dashboardPack);


  if(!usingActions){
    await createDashboardLocal(accountId, dashboardPack);

    await createAlertLocal(accountId, dashboardPack, policyId);
  }
  
}

const createPolicy = async (accountId: number, pack: string) => {
  const policyName = pack.charAt(0).toUpperCase() + pack.slice(1) + ' default alert policy';
  
  const variables = {
    accountId: accountId,
    name: policyName
  }
  const response = await client.request(addPolicy, variables);
  return response.alertsPolicyCreate.id;
}

const createDashboardLocal = async (accountId: number, pack: string) => {
  const replacer = new RegExp('"accountId":0', 'g');

  const dir = `${__dirname}/../../../../${pack}/dashboards`;
  const importedFiles: Array<importedDashboardBody> = fs
    .readdirSync(dir)
    .filter(name => path.extname(name) === '.json')
    .map(name => require(path.join(dir, name)));

  importedFiles.forEach(file => {
    file.permissions = 'PUBLIC_READ_WRITE';
    let stringifiedDashboard = JSON.stringify(file);
    stringifiedDashboard = stringifiedDashboard.replace(
      replacer,
      `"accountId": ${accountId}`
    );

    const parsedDashboard: dashboardBody = JSON.parse(stringifiedDashboard);

    const variables = {
      accountId: accountId,
      dashboard: parsedDashboard
    };

    client.request(addDashboard, variables);
  })
}

const createAlertLocal = async (accountId: number, pack: string, policyId: number) => {
  let variables = {
    accountId: accountId,
    condition: undefined,
    policyId: policyId
  };

  const dir = `${__dirname}/../../../../${pack}/alerts`

  const fileNames: Array<string> = fs
    .readdirSync(dir)
    .filter(name => path.extname(name) === '.yml')

  fileNames.forEach(file => {
    const loadedYaml = yaml.load(fs.readFileSync(`${dir}/${file}`, 'utf-8'));
    let parsedAlert = JSON.parse(JSON.stringify(loadedYaml));
    if(parsedAlert.type === 'BASELINE') {
      let filledFile = transformData(parsedAlert);
      variables.condition = filledFile;
      client.request(baselineMutation, variables);
    } else if (parsedAlert.type === 'STATIC') {
      let filledFile = transformData(parsedAlert);
      variables.condition = filledFile;
      client.request(staticMutation, variables);
    } else if (parsedAlert.type === 'OUTLIER') {
      let filledFile = transformData(parsedAlert);
      variables.condition = filledFile;
      client.request(outlierMutation, variables);
    }
  });
};

const transformData = (incomingFile: any) => {
  console.log('Name: ', incomingFile.name);
  if(!incomingFile.enabled) {
    incomingFile.enabled = false;
  }
  // if(!incomingFile.terms.operator) { // remove this section and throw an error
  //   incomingFile.terms.forEach((term: { operator: string; }) => {
  //     term.operator = 'ABOVE';
  //   });
  // }
  if(incomingFile.type) {
    delete incomingFile.type
  }
  if(incomingFile.details) {
    delete incomingFile.details
  }

  return incomingFile;
}


export default importer
