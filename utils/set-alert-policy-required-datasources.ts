import { passedProcessArguments } from './lib/helpers';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import Quickstart from './lib/Quickstart';
import Alert from './lib/Alert'

const getQuickstartNames = async (ghUrl?: string,
  ghToken?: string) : Promise<{hasFailed: boolean, results: string[]}>=> {
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
      .map(({ filename }) => new Quickstart(filename).config.title);

    return {hasFailed: false, results: quickstartNames}
}

const setAlertPolicyRequiredDataSources = async(ghUrl: string, ghToken: string | undefined) => {
  // Need to return dataSources along with the names 
  const { hasFailed: hasQuickstartNamesFailed, results: quickstartNames} = await getQuickstartNames(ghUrl, ghToken)

  if (hasQuickstartNamesFailed) {
    return hasQuickstartNamesFailed
  }

  const alertPoliciesWithCurrentDataSources = quickstartNames.map((quickstart) => Alert.getAlertPolicyRequiredDataSources(quickstart))

  //alertPoliciesWithCurrentDataSources = [{id: 'alert-policy-id', dataSources: ['datasource1']}, {id: 'alert-policy-id-2', dataSources: ['dataSource2']}]

  //On submission merge required data sources lists for each alert policy 


  //Temporary to allow for pushing
  const hasFailed = false;
  return hasFailed
}

const main = async () => {
  const [ghUrl] = passedProcessArguments();
  const ghToken = process.env.GITHUB_TOKEN;

  const hasFailed = await setAlertPolicyRequiredDataSources(ghUrl, ghToken);

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
