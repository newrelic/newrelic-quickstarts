import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import { GITHUB_REPO_BASE_URL } from '../constants';
abstract class Component<ConfigType, MutationVariablesType> {
  public identifier: string; // Local path to the component. Ex: python/flask
  public configPath: string; // Absolute path to the config file within the repository
  public config: ConfigType;
  public isValid = true;
  public basePath: string;

  constructor(
    idenifier: string,
    basePath: string = path.join(__dirname, '..', '..')
  ) {
    this.basePath = basePath;
    this.identifier = idenifier;
    this.configPath = this.getConfigFilePath();
    this.config = this.getConfigContent();
  }

  abstract getConfigFilePath(): string;
  abstract getConfigContent(): ConfigType;
  abstract getMutationVariables(): MutationVariablesType;

  get fullPath() {
    return path.join(this.basePath, this.configPath);
  }

  /**
   * Helper method for reading YAML-based configuration files.
   */
  protected _getYamlConfigContent(): ConfigType {
    if (!this.isValid) {
      return this.config;
    }

    try {
      const file = fs.readFileSync(this.fullPath);

      return yaml.load(file.toString('utf-8')) as ConfigType;
    } catch (e) {
      console.log('Unable to parse YAML config', this.configPath, e);
      this.isValid = false;

      return this.config;
    }
  }
  /**
   * Creates the GitHub url of an asset within the main directory of a quickstart.
   * @param assetFilePath - The file path of an asset.
   * @return Returns an object containing the GitHub url of an asset.
   */
  static getAssetSourceUrl(assetFilePath: string): string {
    // path = dashboards/apache/screenshot1.png
    return `${GITHUB_REPO_BASE_URL}/${assetFilePath}`;
  }

  /**
   * Removes the specified path prefix from a file path
   * @param filePath - The path to change
   * @param basePath - The portion of the path to remove
   * @returns - The path with the prefix
   */
  static removeBasePath(filePath: string, basePath: string): string {
    const shortPath = filePath.split(`${basePath}/`).pop();
    return shortPath ?? filePath;
  }
}

export default Component;
