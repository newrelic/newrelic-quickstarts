import { dashboardBody, importedDashboardBody } from "./types/dashboardInput"
import { gql, GraphQLClient } from 'graphql-request'
import * as yargs from 'yargs';
import { argv } from "process";


const url = 'https://api.newrelic.com/graphql';

export const dashboardImporter = async (accountId: number, nrApiKey: string, dashboardPack: string) : Promise<void> => {
    if(!accountId && !nrApiKey && !dashboardPack){
        const argv = yargs.options({
            accountId: {
                alias: 'id',
                demandOption: true,
                description: 'NR account id'
            },
            nrApiKey: {
                alias: 'key',
                demandOption: true,
                description: 'NR API Key'
            },
            dashboardPack: {
                alias: 'pack',
                demandOption: true,
                description: 'NR API Key'
            },
        }).argv;

        accountId = argv.accountId as number;
        nrApiKey = argv.nrApiKey as string;
        dashboardPack = argv.dashboardPack as string;
    }
    console.log(argv);

    const replacer = new RegExp('"accountId":0', 'g')

    const importedFile: importedDashboardBody = await import(`../../../../${dashboardPack}/dashboards/${dashboardPack}.json`);

    let dashboard: dashboardBody = importedFile.default;
    dashboard.permissions = 'PUBLIC_READ_WRITE';

    let stringifiedDashboard = JSON.stringify(dashboard);
    stringifiedDashboard = stringifiedDashboard.replace(replacer, `"accountId": ${accountId}`);

    const parsedDashboard = JSON.parse(stringifiedDashboard);

    const addDashboard = gql`
        mutation ($accountId: Int!, $dashboard: DashboardInput!) {
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
    };

    const client = new GraphQLClient(url, { headers: { 'Content-Type': 'application/json', 'API-Key': `${nrApiKey}` }})
    client.request(addDashboard,variables);
}
