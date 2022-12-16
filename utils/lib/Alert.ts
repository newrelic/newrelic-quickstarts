import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as glob from 'glob';

import Component from './Component';

import type {
  AlertType,
  QuickstartAlertInput,
} from '../types/QuickstartMutationVariable';
import type { QuickstartConfigAlert } from '../types/QuickstartConfig';

import {
  fetchNRGraphqlResults,
  ErrorOrNerdGraphError,
} from './nr-graphql-helpers';

import {ALERT_POLICY_REQUIRED_DATA_SOURCES_QUERY} from '../constants'

interface RequiredDataSources {
  id: string;
}
interface AlertPolicy {
  id: string;
  metadata: {
    requiredDataSources: RequiredDataSources[]
  }
}

type AlertPolicyRequiredDataSourcesQueryResults = {
  actor: {
    nr1Catalog: {
      search: {
        results: AlertPolicy[]
      }
    }
  }
}

type AlertPolicyRequiredDataSourcesQueryVariables = {
  query: string;
}

interface AlertPolicyDataSources{
  id: string,
  requiredDataSources: string[]
}
class Alert extends Component<QuickstartConfigAlert[], QuickstartAlertInput[]> {
  /**
   * Returns the **directory** for the alert policy
   */
  getConfigFilePath() {
    const filePaths = glob.sync(
      path.join(this.basePath, 'alert-policies', this.identifier)
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      console.error(
        `Alert at ${this.identifier} does not exist. Please double check this location.\n`
      );
      return '';
    }

    return Component.removeBasePath(filePaths[0], this.basePath);
  }

  getConfigContent() {
    if (!this.isValid) {
      return this.config;
    }

    const filePaths = glob.sync(
      path.join(this.basePath, this.configPath, '*.+(yml|yaml)')
    );

    // if there are no YAML files in this directory, it's invalid
    if (!Array.isArray(filePaths) || !filePaths.length) {
      this.isValid = false;
      return this.config;
    }

    // loop through all the YAML files and get their content
    try {
      return filePaths.map((filepath) => {
        const file = fs.readFileSync(filepath);

        return yaml.load(file.toString('utf-8')) as QuickstartConfigAlert;
      });
    } catch (e) {
      console.log(`Unable to parse YAML config for alert: ${this.configPath}`);
      this.isValid = false;

      return this.config;
    }
  }

  getMutationVariables() {
    if (!this.isValid) {
      console.error(
        `Alert is invalid.\nPlease check if the path at ${this.identifier} exists.`
      );
      return []
    }

    return this.config.map((condition) => {
      const { description, name, type } = condition;

      return {
        description: description && description.trim(),
        displayName: name && name.trim(),
        rawConfiguration: JSON.stringify(condition),
        sourceUrl: Component.getAssetSourceUrl(this.configPath),
        type: type && (type.trim() as AlertType),
      };
    });
  }
   /**
   * Static method of data sources associated
   * with dashboard template id
   * @returns - object with alert policy ids and NGerrors
   */
  static async getAlertPolicyRequiredDataSources(alertName: string): Promise<{ids: AlertPolicyDataSources[], errors?: ErrorOrNerdGraphError[]}> {
    const { data, errors } = await fetchNRGraphqlResults<AlertPolicyRequiredDataSourcesQueryVariables, AlertPolicyRequiredDataSourcesQueryResults>({
    queryString: ALERT_POLICY_REQUIRED_DATA_SOURCES_QUERY,
    variables: { query: `${alertName} alert policy`},
  });

  const alertPoliciesWithDataSources = data?.actor?.nr1Catalog?.search?.results?.map((result: AlertPolicy) => ({id: result.id, requiredDataSources: result.metadata.requiredDataSources.map((dataSource) => (dataSource.id))})) 

  return {ids: alertPoliciesWithDataSources, errors}
  }
}

export default Alert;
