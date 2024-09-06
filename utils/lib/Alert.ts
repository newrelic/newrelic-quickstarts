import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as glob from 'glob';

import Component from './Component';

import logger from '../logger';
import type {
  AlertType,
  QuickstartAlertInput,
} from '../types/QuickstartMutationVariable';
import type { QuickstartConfigAlert } from '../types/QuickstartConfig';
import type { NerdGraphResponseWithLocalErrors } from '../types/nerdgraph';

import {
  fetchNRGraphqlResults,
  ErrorOrNerdGraphError,
} from './nr-graphql-helpers';

import {
  ALERT_POLICY_REQUIRED_DATA_SOURCES_QUERY,
  ALERT_POLICY_SET_REQUIRED_DATA_SOURCES_MUTATION,
} from '../constants';

import { CUSTOM_EVENT, recordNerdGraphResponse } from '../newrelic/customEvent';

// We don't currently validate the raw configuration of an alert.
// However, we _do_ know that alerts cannot have a `TIMESERIES` keyword
// within a nrql query. This portion is to help validate against
// very specific edge cases to ensure we don't have anything break
// during an install once it hits our UIs.
// RegExp matches the _first_ instance of any invalid keywords
const INVALID_REGEX = /\sTIMESERIES[\s]?/mi

interface RequiredDataSources {
  id: string;
}
interface AlertPolicy {
  id: string;
  metadata?: {
    requiredDataSources: RequiredDataSources[];
  };
}

type AlertPolicyRequiredDataSourcesQueryResults = {
  actor: {
    nr1Catalog: {
      search: {
        results: AlertPolicy[];
      };
    };
  };
};

type AlertPolicyRequiredDataSourcesQueryVariables = {
  query: string;
};

export interface AlertPolicyDataSource {
  id: string;
  dataSourceIds: string[];
}

type AlertPolicySetRequiredDataSourcesMutationVariables = {
  templateId: string;
  dataSourceIds: string[];
};

export type AlertPolicySetRequiredDataSourcesMutationResults = {
  nr1CatalogSetRequiredDataSourcesForAlertPolicyTemplate: {
    alertPolicyTemplate: {
      id: string;
    };
  };
};

export type SubmitSetRequiredDataSourcesMutationResult =
  | NerdGraphResponseWithLocalErrors<AlertPolicySetRequiredDataSourcesMutationResults>
  | { errors: ErrorOrNerdGraphError[] };

class Alert extends Component<QuickstartConfigAlert[], QuickstartAlertInput[]> {
  constructor(identifier: string, basePath?: string) {
    super(identifier, basePath);
    this.isValid = this.validate();
  }

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
      return [];
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
   * Validation function for edge cases found in Alerts.
   *
   * > Note: We do not currently validate the schema of an alert through
   * our API. This validation is used for edge cases found within our ecosystem.
   */
  validate(regex = INVALID_REGEX) {
    if (!this.isValid) {
      return false;
    }

    logger.debug(`Running custom validation for alert at ${this.identifier}`);

    const mutationVariables = this.getMutationVariables();

    const validations = mutationVariables.map((variable) => {
      const { rawConfiguration, displayName } = variable;
      logger.debug(`Alert Condition: Validating ${displayName}`);

      // JSON.parse can throw if argument is not the shape of an object
      try {
        const parsedConfiguration = JSON.parse(rawConfiguration);
        const nrqlQuery = (parsedConfiguration?.nrql?.query as string) ?? '';

        const containsInvalidQuery = regex.test(nrqlQuery);

        if (containsInvalidQuery) {
          logger.info(
            `Alert Condition: ${this.identifier} contains an invalid keyword in query`
          );
          return false;
        }

        return true;
      } catch (error) {
        logger.error(`Alert Condition: Validaiton for ${displayName} failed with an error`);

        return false;
      }
    });

    logger.debug(`Alert condition: Finished validation for alert at ${this.identifier}`);

    return validations.every(Boolean);
  }

  /**
   * Static method that gets the alert policy associated with a quickstart and it's current data sources
   * @returns - object with alert policy ids, required data sources and NG errors
   */
  static async getAlertPolicyRequiredDataSources(quickstart: {
    name: string;
    dataSourceIds: string[];
  }): Promise<
    | { alertPolicy: AlertPolicyDataSource }
    | { alertPolicy: null; errors: ErrorOrNerdGraphError[] }
  > {
    const policyName = `${quickstart.name} alert policy`;

    logger.info(`Request data sources for ${policyName}`);
    const { data, errors } = await fetchNRGraphqlResults<
      AlertPolicyRequiredDataSourcesQueryVariables,
      AlertPolicyRequiredDataSourcesQueryResults
    >({
      queryString: ALERT_POLICY_REQUIRED_DATA_SOURCES_QUERY,
      variables: { query: policyName },
    });
    logger.debug(`Results for ${policyName}`, { data, errors });

    const results = data?.actor?.nr1Catalog?.search?.results;
    const hasFailed = quickstart.dataSourceIds.length > 1;

    if (errors && errors.length > 0) {
      logger.debug(`Errors requesting data sources for ${policyName}`, {
        errors,
      });
      return { alertPolicy: null, errors };
    }

    if (results === undefined || results.length === 0) {
      logger.info(`No alert policy for quickstart ${quickstart.name} exists`);

      return { alertPolicy: null, errors: [] };
    }

    if (hasFailed) {
      logger.info(
        `Multiple Quickstart data sources detected for Quickstart: ${quickstart.name} with AlertPolicy: ${results[0].id} must update manually`
      );

      recordNerdGraphResponse(
        hasFailed,
        CUSTOM_EVENT.MULTIPLE_DATA_SOURCES_DETECTED,
        quickstart.name
      );

      return { alertPolicy: null, errors: [] };
    }

    const alertPoliciesWithUpdatedDataSources = results.map(
      (result: AlertPolicy) => {
        const currDataSourceIds =
          result?.metadata?.requiredDataSources.map(
            (dataSource) => dataSource.id
          ) ?? [];

        return {
          id: result.id,
          dataSourceIds: [
            ...new Set([...currDataSourceIds, ...quickstart.dataSourceIds]),
          ],
        };
      }
    );

    return { alertPolicy: alertPoliciesWithUpdatedDataSources[0] };
  }

  /**
   * Static method of mutating alert policy with updated required data sources
   * @returns - Object with the alert policy template id or errors
   */
  static async submitSetRequiredDataSourcesMutation(
    templateId: string,
    dataSourceIds: string[]
  ) {
    logger.info(`Submitting mutation for alert policy ${templateId}`, {
      templateId,
      dataSourceIds,
    });
    const result = await fetchNRGraphqlResults<
      AlertPolicySetRequiredDataSourcesMutationVariables,
      AlertPolicySetRequiredDataSourcesMutationResults
    >({
      queryString: ALERT_POLICY_SET_REQUIRED_DATA_SOURCES_MUTATION,
      variables: { templateId, dataSourceIds },
    });
    logger.info(`Submitted mutation for alert policy ${templateId}`);
    logger.debug(`Results for alert policy mutation`, { ...result });

    return result;
  }

  static getAll() {
    const alertPaths = glob.sync(path.join(__dirname, '..', '..', 'alert-policies', '**', '*.+(yml|yaml)'));
    return alertPaths.map(alertPath => {
      // The identifier for alerts is the folder and the file name
      // e.g. `node-js/HighCpuUtilization.yml`
      const identifier = path.join(...alertPath.split('/').slice(-2, -1));
      return new Alert(identifier);
    });
  }
}

export default Alert;
