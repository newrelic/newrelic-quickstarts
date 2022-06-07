import * as path from 'path';

abstract class Component<ConfigType, MutationVariablesType> {
  public localPath: string; // Local path to the component. Ex: python/flask
  public configPath: string; // Absolute path to the config file within the repository
  public config: ConfigType;
  public isValid = true;
  public basePath = path.join(__dirname, '../..');

  constructor(localPath: string) {
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
}

export default Component;
