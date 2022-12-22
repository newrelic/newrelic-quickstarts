import { passedProcessArguments } from './lib/helpers';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import Quickstart from './lib/Quickstart';
import Alert, { AlertPolicyDataSource } from './lib/Alert'
import { chunk } from './lib/nr-graphql-helpers';

type QuickstartResults = {
  name: string,
  dataSourceIds: string[] 
}

const getQuickstartNameAndDataSources = async (ghUrl?: string,
  ghToken?: string) : Promise<{hasFailed: boolean, results: QuickstartResults[]}>=> {
    if (!ghToken) {
      console.error('GITHUB_TOKEN is not defined.');
      return { hasFailed: true, results: [] };
    }
  
    if (!ghUrl) {
      console.error('Github PR URL is not defined.');
      return { hasFailed: true, results: [] };
    }

    const files = await fetchPaginatedGHResults(ghUrl, ghToken);

    const quickstartNames = filterQuickstartConfigFiles(files)
      .filter(isNotRemoved)
      .map(({ filename }) => {const quickstart = new Quickstart(filename)
      return {name: quickstart.config.title, dataSourceIds: quickstart.config.dataSourceIds ?? []}
      });

    return {hasFailed: false, results: quickstartNames}
}

const setAlertPoliciesRequiredDataSources = async(ghUrl: string, ghToken: string | undefined): Promise<boolean> => {
  // Need to return dataSources along with the names 
  const { hasFailed: hasQuickstartNamesFailed, results: quickstartNamesAndDataSources} = await getQuickstartNameAndDataSources(ghUrl, ghToken)

  if (hasQuickstartNamesFailed) {
    return hasQuickstartNamesFailed
  }


  const results = await Promise.all(quickstartNamesAndDataSources.map(async(quickstart) => { 
    
    const alertPolicy = await Alert.getAlertPolicyRequiredDataSources(quickstart)
    
    if (alertPolicy.alertPolicy === null) {
      console.error(`Failed to get alert policy for quickstart ${quickstart.name}`)

      return {errors: alertPolicy.errors}
    }
    
    const {id: templateId, dataSourceIds } = alertPolicy.alertPolicy

    const result = await Alert.submitSetRequiredDataSourcesMutation(templateId, dataSourceIds)

    if(result.errors) {
      console.error(`Failed to update alert policy ${templateId} for quickstart ${quickstart.name}`)

    }

    return result
  })
  )

  const hasFailed = results.some(
    (result) => result?.errors && result.errors.length > 0
  );

  return hasFailed;
}


const main = async () => {
  const [ghUrl] = passedProcessArguments();
  const ghToken = process.env.GITHUB_TOKEN;

  const hasFailed = await setAlertPoliciesRequiredDataSources(ghUrl, ghToken);

  recordNerdGraphResponse(
    hasFailed,
    CUSTOM_EVENT.SET_ALERT_POLICY_REQUIRED_DATASOURCES
  );

  if (hasFailed) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node create_validate_pr_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
 if (require.main === module) {
  main();
}
