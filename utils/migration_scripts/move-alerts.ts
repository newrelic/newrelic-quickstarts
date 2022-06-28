import * as path from 'path';
import * as fs from 'fs';
import * as glob from 'glob';
import Quickstart from '../lib/Quickstart';

import { RmDirOptions } from 'fs';

const DIR_PATH = path.resolve(__dirname, '../../alert-policies');

/** if a top-level `alert-policies` doesn't exist, create it */
const setupAlertPolicyDir = () => {
  if (!fs.existsSync(DIR_PATH)) {
    fs.mkdirSync(DIR_PATH);
  }
};

const main = () => {
  setupAlertPolicyDir();

  // find all alerts with alert conditions
  const quickstartsWithAlerts = Quickstart.getAll()
    .map(quickstart => path.dirname(quickstart.configPath))
    .filter((dir) => fs.existsSync(path.join(dir, 'alerts')));

  // make an alert-policy directory for each quickstart
  // copy the alert conditions into the new directory
  const newAlertPolicyDirs = quickstartsWithAlerts.map((quickstartDirPath) => {
    const quickstartName = path.basename(quickstartDirPath);
    const oldAlertsDir = path.join(quickstartDirPath, 'alerts');
    const newAlertPolicyDir = path.join(DIR_PATH, quickstartName);

    fs.cpSync(oldAlertsDir, newAlertPolicyDir, { recursive: true });

    return newAlertPolicyDir;
  });

  // remove the `---` from the top / bottom of the condition files
  for (const alertPolicyDir of newAlertPolicyDirs) {
    for (const filename of fs.readdirSync(alertPolicyDir)) {
      const filepath = path.join(alertPolicyDir, filename);
      const fileContent = fs.readFileSync(filepath, { encoding: 'utf8' });
      const updatedFile = fileContent.replace(/---\n/g, '');

      fs.writeFileSync(filepath, updatedFile, 'utf8');
    }
  }

  for (const quickstartDirPath of quickstartsWithAlerts) {
    // update the quickstart config files to reference the policy
    const filePaths = glob.sync(path.join('/', quickstartDirPath, 'config.*'));

    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return;
    }

    const configFilePath = filePaths.pop();

    const quickstartName = path.basename(quickstartDirPath);
    const rawConfig = fs.readFileSync(configFilePath!, { encoding: 'utf-8' });
    const updatedConfig = rawConfig.concat(
      '\nalertPolicies:\n  - ',
      quickstartName
    );

    fs.writeFileSync(configFilePath!, updatedConfig, 'utf-8');

    // remove the alerts from the quickstart directory
    fs.rmdirSync(path.join('/', quickstartDirPath, 'alerts/'), {
      recursive: true,
      force: true,
    } as RmDirOptions);
  }
};

main();
