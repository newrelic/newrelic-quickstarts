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
      console.log('Unable to parse YAML config', this.configPath, e);
      this.isValid = false;

      return this.config;
    }
  }

  getMutationVariables() {
    if (!this.isValid) {
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
}

export default Alert;
