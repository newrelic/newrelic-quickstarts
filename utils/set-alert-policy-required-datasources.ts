import { passedProcessArguments } from './lib/helpers';
import { CUSTOM_EVENT, recordNerdGraphResponse } from './newrelic/customEvent';
import {
  fetchPaginatedGHResults,
  filterQuickstartConfigFiles,
  isNotRemoved,
} from './lib/github-api-helpers';
import Quickstart from './lib/Quickstart';

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
  const { hasFailed: hasQuickstartNamesFailed, results: quickstartNames} = await getQuickstartNames(ghUrl, ghToken)


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
}