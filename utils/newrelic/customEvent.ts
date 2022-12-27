import fetch from 'node-fetch';

const NEW_RELIC_ACCOUNT_ID = '11554270';
const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY;

/**
 * Enum of custom events that we currently track.
 */
export enum CUSTOM_EVENT {
  /** Event name which corresponds to tracking the validation of quickstarts. */
  VALIDATE_QUICKSTARTS = 'ValidateQuickstarts',
  /** Event name which corresponds to tracking the submission or update of quickstarts. */
  UPDATE_QUICKSTARTS = 'UpdateQuickstarts',
  /** Event name which corresponds to tracking the validation of data sources. */
  VALIDATE_DATA_SOURCES = 'ValidateDataSources',
  /** Event name which corresponds to tracking the submission or update of data sources. */
  UPDATE_DATA_SOURCES = 'UpdateDataSources',
  /** Event name which corresponds to tracking the validation of install plans. */
  VALIDATE_INSTALL_PLANS = 'ValidateInstallPlans',
  /** Event name which corresponds to tracking the submission or update of install plans. */
  UPDATE_INSTALL_PLANS = 'UpdateInstallPlans',
  /** Event name which corresponds to tracking the setting of dashboard required data sources. */
  SET_DASHBOARD_REQUIRED_DATASOURCES = 'SetDashboardRequiredDataSources',
  /** Event name which corresponds to tracking the setting of alert policy required data sources. */
  SET_ALERT_POLICY_REQUIRED_DATASOURCES = 'SetAlertPolicyRequiredDataSources',
  /** Event name which corresponds to multiple data sources in a quickstart which prevents assigning them to an alert policy or dashboard template */
  MULTIPLE_DATA_SOURCES_DETECTED = 'MultipleDataSourcesDetected',
}

/**
 * Helper function to make an API request to the Events API.
 *
 * @param {string} key New Relic license key for the account
 * @param {string} accountId The New Relic account to send the request to
 * @param {Object} data The data to be sent
 * @returns {Promise<boolean>} Whether or not the request was (eventually) successful
 */
const apiRequest = async (
  key: string,
  accountId: string,
  data: Object
): Promise<Boolean> => {
  const url = `https://staging-insights-collector.newrelic.com/v1/accounts/${accountId}/events`;

  if (!NEW_RELIC_LICENSE_KEY) {
    console.error('NEW_RELIC_LICENSE_KEY is not set');
    return false;
  }

  try {
    await fetch(url, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        'Api-Key': key,
      },
    });

    return true;
  } catch (e) {
    /* eslint-disable-next-line no-console */
    console.error('Unable to track custom event:', data, e);

    return false;
  }
};

/**
 * Tracks an event in New Relic using the custom Events API.
 *
 * @param {string} eventType The name of the event type to track
 * @param {Object} [metadata] (Optional) metadata to attach to the event
 * @returns {Promise<boolean>} Whether or not the request was (eventually) successful
 */
export const track = async (
  eventType: CUSTOM_EVENT,
  metadata: Object = {}
): Promise<Boolean> => {
  if (!NEW_RELIC_LICENSE_KEY) {
    console.error('NEW_RELIC_LICENSE_KEY not set.');
    return false;
  }
  if (!NEW_RELIC_ACCOUNT_ID) {
    console.error('NEW_RELIC_ACCOUNT_ID not set.');
    return false;
  }

  return apiRequest(NEW_RELIC_LICENSE_KEY, NEW_RELIC_ACCOUNT_ID, {
    eventType,
    account: NEW_RELIC_ACCOUNT_ID,
    ...metadata,
  });
};

/**
 * Send a custom New Relic event recoreding the success status and whether or
 * not this was a dry-run attempt.
 */
export const recordNerdGraphResponse = async (
  hasFailed: boolean,
  event: CUSTOM_EVENT,
  quickstartName?: string
) => {
  const status = hasFailed ? 'failed' : 'success';

  await track(event, { status, quickstartName });
};
