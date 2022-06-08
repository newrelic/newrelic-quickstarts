import * as path from 'path';
import * as glob from 'glob';

import Component from './Component';
import { removeRepoPathPrefix, getAssetSourceUrl } from './helpers';
import type {
  AlertType,
  QuickstartAlertInput,
} from '../types/QuickstartMutationVariable';
import type { QuickstartConfigAlert } from '../types/QuickstartConfig';

class Alert extends Component<QuickstartConfigAlert, QuickstartAlertInput> {
  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    const filePaths = glob.sync(
      path.join(this.basePath, 'alert-policies', this.localPath, '*.{yml|yaml}')
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      return '';
    }

    return removeRepoPathPrefix(filePaths[0]);
  }

  // FIXME: alert *policies* have multiple config YAML files...
  getConfigContent() {
    return this._getYamlConfigContent();
  }

  getMutationVariables() {
    const { description, name, type } = this.config;

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
