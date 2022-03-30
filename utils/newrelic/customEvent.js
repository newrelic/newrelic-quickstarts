/**
 * This module is intended for use only with SSR pages.
 * For monitoring & creating events for browser pages, use the browser agent instead.
 */

// taken from gatsby-config.js
const NEW_RELIC_ACCOUNT_ID = '11554270';
const NEW_RELIC_LICENSE_KEY = process.env.NEW_RELIC_LICENSE_KEY;

const fetch = require('node-fetch');

/**
 * Helper function to make an API request to the Events API.
 *
 * @param {string} key New Relic license key for the account
 * @param {string} accountId The New Relic account to send the request to
 * @param {Object} data The data to be sent
 * @returns {Promise<boolean>} Whether or not the request was (eventually) successful
 */
const apiRequest = async (key, accountId, data) => {
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
const track = async (eventType, metadata = {}) =>
  apiRequest(NEW_RELIC_LICENSE_KEY, NEW_RELIC_ACCOUNT_ID, {
    eventType,
    account: NEW_RELIC_ACCOUNT_ID,
    ...metadata,
  });

module.exports = {
  track
};