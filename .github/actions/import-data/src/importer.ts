import {dashboardBody, importedDashboardBody} from './types/dashboardInput'
import {gql, GraphQLClient} from 'graphql-request'
import * as yargs from 'yargs'
import fs from 'fs'
import path from 'path'

const url = 'https://api.newrelic.com/graphql';

const client = new GraphQLClient(url, {
    headers: {'Content-Type': 'application/json'}
});

export const dashboardImporter = async (
  accountId: number,
  nrApiKey: string,
  dashboardPack: string
): Promise<void> => {
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
  }

  const replacer = new RegExp('"accountId":0', 'g')
  const dir = `${__dirname}/../../../../${dashboardPack}/dashboards`
  client.setHeader('API-Key', nrApiKey);
  const importedFiles: Array<importedDashboardBody> = fs
    .readdirSync(dir)
    .filter(name => path.extname(name) === '.json')
    .map(name => require(path.join(dir, name)));

  importedFiles.forEach(file => {
    file.permissions = 'PUBLIC_READ_WRITE'
    let stringifiedDashboard = JSON.stringify(file)
    stringifiedDashboard = stringifiedDashboard.replace(
      replacer,
      `"accountId": ${accountId}`
    )
    const parsedDashboard = JSON.parse(stringifiedDashboard)

    const addDashboard = gql`
      mutation($accountId: Int!, $dashboard: DashboardInput!) {
        dashboardCreate(accountId: $accountId, dashboard: $dashboard) {
          errors {
            description
            type
          }
          entityResult {
            guid
          }
        }
      }
    `

    const variables = {
      accountId: accountId,
      dashboard: parsedDashboard
    }
    client.request(addDashboard, variables)
  })
}

export default dashboardImporter
