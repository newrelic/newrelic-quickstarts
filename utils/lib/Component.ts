abstract class Component<ConfigType> {
  public name: string;
  public configPath: string;
  public config: ConfigType;
  public isValid = true;

  constructor(name: string) {
    this.name = name
    this.configPath = this.getConfigFilePath();
    this.config = this.getConfigContent();
    // this.isValid = this.validate();
  }

  abstract getConfigFilePath(): string;
  abstract getConfigContent(): ConfigType;
  abstract validate(): boolean;
}

export default Component;
