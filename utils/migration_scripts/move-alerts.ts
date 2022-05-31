import * as path from 'path';
import * as fs from 'fs';

import { findMainQuickstartConfigFiles } from '../helpers';

const DIR_PATH = path.resolve(__dirname, '../../alert-policies');

/** if a top-level `alert-policies` doesn't exist, create it */
const setupAlertPolicyDir = () => {
  if (!fs.existsSync(DIR_PATH)) {
    fs.mkdirSync(DIR_PATH);
  }
};

const main = () => {
  // find all alerts with alert conditions
  const quickstartsWithAlerts = findMainQuickstartConfigFiles()
    .map(path.dirname)
    .filter((dir) => fs.existsSync(path.join(dir, 'alerts')));

  // make an alert-policy directory for each quickstart
  // move the alert conditions into the new directory
  setupAlertPolicyDir();
  for (const quickstartDirName of quickstartsWithAlerts) {
    const oldAlertsDir = path.join(quickstartDirName, 'alerts');
    const newAlertPolicyDir = path.join(DIR_PATH, quickstartDirName);
    // FIXME: this is not working as intended...
    fs.cpSync(oldAlertsDir, newAlertPolicyDir, { recursive: true });
  }

  // remove the `---` from the top / bottom of the condition files
  // update the quickstart config files to reference the policy
  // remove the alerts from the quickstart directory
};

main();
