import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

abstract class Component<ConfigType, MutationVariablesType> {
  public localPath: string; // Local path to the component. Ex: python/flask
  public configPath: string; // Absolute path to the config file within the repository
  public config: ConfigType;
  public isValid = true;
  public basePath: string;

  constructor(
    localPath: string,
    basePath: string = path.join(__dirname, '../..')
  ) {
    this.basePath = basePath;
    this.localPath = localPath;
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
}

export default Component;
