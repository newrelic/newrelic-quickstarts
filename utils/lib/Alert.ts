import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as glob from 'glob';

import Component from './Component';
import { removeRepoPathPrefix, getAssetSourceUrl } from './classHelpers';

import type {
  AlertType,
  QuickstartAlertInput,
} from '../types/QuickstartMutationVariable';
import type { QuickstartConfigAlert } from '../types/QuickstartConfig';

class Alert extends Component<QuickstartConfigAlert[], QuickstartAlertInput> {
  /**
   * Returns the **directory** for the alert policy
   */
  getConfigFilePath() {
    const filePaths = glob.sync(
      path.join(this.basePath, 'alert-policies', this.localPath)
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      return '';
    }

    return removeRepoPathPrefix(filePaths[0]);
  }

  getConfigContent() {
    if (!this.isValid) {
      return this.config;
    }

    const filePaths = glob.sync(path.join(this.configPath, '*.{yml|yaml}'));

    // if there are no YAML files in this directory, it's invalid
    if (!Array.isArray(filePaths) || !filePaths.length) {
      this.isValid = false;
      return this.config;
    }

    // loop through all the YAML files and get their content
    try {
      return filePaths.map((filepath) => {
        const file = fs.readFileSync(path.join(this.basePath, filepath));

        return yaml.load(file.toString('utf-8')) as QuickstartConfigAlert;
      });
    } catch (e) {
      console.log('Unable to parse YAML config', this.configPath, e);
      this.isValid = false;

      return this.config;
    }
  }

  // TODO: update this to work like adaptQuickstartAlertsInput
  // NOTE: this.config is an **array** of configuration
  getMutationVariables() {
    const { description, name, type } = this.config[0];

    return {
      description: description && description.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(this.config),
      sourceUrl: getAssetSourceUrl(this.configPath),
      type: type && (type.trim() as AlertType),
    };
  }
}

export default Alert;
