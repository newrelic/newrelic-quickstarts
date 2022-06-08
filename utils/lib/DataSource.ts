import * as path from 'path';
import * as glob from 'glob';

import Component from './Component';
import { GITHUB_RAW_BASE_URL } from '../constants';
import { removeRepoPathPrefix } from './helpers';

import type {
  DataSourceConfig,
  DataSourceConfigInstallDirective,
} from '../types/DataSourceConfig';
import type { DataSourceInstallDirectiveInput } from '../types/DataSourceMutationVariable';

class DataSource extends Component<DataSourceConfig, string> {
  /**
   * @returns Filepath for the configuration file (from top-level directory).
   */
  getConfigFilePath() {
    const filePaths = glob.sync(
      path.join(this.basePath, 'data-sources', this.localPath, '*.{yml|yaml}')
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      return '';
    }

    return removeRepoPathPrefix(filePaths[0]);
  }

  getConfigContent() {
    return this._getYamlConfigContent();
  }

  /**
   * Get the variables for the **Quickstart** mutation.
   *
   * @returns The ID for this data source
   */
  getMutationVariables() {
    return this.config.id;
  }

  /**
   * Get the variables for the **Data Source** mutation.
   *
   * @returns Mutation variables
   */
  public getDataSourceMutationVariables() {
    const { displayName, categoryTerms, keywords, description } = this.config;

    return {
      displayName: displayName.trim(),
      icon: this._getIconUrl(),
      install: this._parseInstall(),
      categoryTerms: categoryTerms && categoryTerms.map((t) => t.trim()),
      keywords: keywords && keywords.map((k) => k.trim()),
      description: description && description.trim(),
    };
  }

  /**
   * Helper method to get the image URL for the icon.
   */
  private _getIconUrl() {
    const { icon } = this.config;
    const dirName = path.dirname(this.configPath);
    const relDirName = removeRepoPathPrefix(dirName);

    return `${GITHUB_RAW_BASE_URL}/${relDirName}/${icon}`;
  }

  /**
   * Helper method to parse the primary and fallback install directives.
   */
  private _parseInstall() {
    const { install } = this.config;

    return {
      primary: this._parseInstallDirective(install.primary),
      fallback:
        install.fallback && this._parseInstallDirective(install.fallback),
    };
  }

  /**
   * Helper method that returns the directive, based on it's type.
   */
  private _parseInstallDirective(
    directive: DataSourceConfigInstallDirective
  ): DataSourceInstallDirectiveInput {
    if ('link' in directive) {
      const { url } = directive.link;

      return {
        link: {
          url: url?.trim() ?? '',
        },
      };
    }

    if ('nerdlet' in directive) {
      const { nerdletId, nerdletState, requiresAccount } = directive.nerdlet;

      return {
        nerdlet: {
          nerdletId: nerdletId.trim() ?? '',
          nerdletState: nerdletState && JSON.stringify(nerdletState),
          requiresAccount: requiresAccount,
        },
      };
    }

    return directive;
  }
}

export default DataSource;
