const Q = require('q');

const URL = "https://google.com" // TODO: update this with the correct url
const RETRY_DURATION = 5000; // 5 seconds
const RETRIES = 3;

const sleep = (ms) => new Promise(done => setTimeout(done, ms));

const test = aysnc (url, retriesRemaining = RETRIES) => {
  if (retriesRemaining === RETRIES) {
    console.log(`[*] Attempting to visit ${url}`);
  } else {
    console.log(`[*] Retries remaining: ${RETRIES - retriesRemaining}`);
  }

  try {
    await $browser.get(url);
  } catch(e) {
    if (retriesRemaining >= 0) {
      console.log(`[!] Unable to visit ${url}, trying again in ${RETRY_DURATION}ms`);
      sleep(RETRY_DURATION);
      test(url, retriesRemaining - 1)
    } else {
      console.warning(`[!] Unable to visit ${url}`);
      throw e;
    }
  }
}
