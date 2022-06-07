import Component from './Component'
import Dashboard from './Dashboard'
import DataSource from './DataSource'
import Alert from './Alert'
import { readQuickstartFile } from '../helpers' 
import type { QuickstartConfig } from '../types/QuickstartConfig'

abstract class Quickstart extends Component<QuickstartConfig> {
  public dashboards: Dashboard[] = [];
  public alerts: Alert[] = [];
  public dataSources: DataSource[] = [];

  constructor(name: string) {
    super(name);
    this.dashboards = this.getDashboards();
    this.alerts = this.getAlerts();
    this.dataSources = this.getDataSources();
  }

  getDashboards(): Dashboard[] {
    this.dashboards = this.config.contents[0]?.dashboards?.map(
      (dashboardName) => new Dashboard(dashboardName)
    ) ?? [];
    return this.dashboards;
  }

  getAlerts(): Alert[] {
    this.alerts = this.config.contents[0]?.alertPolicies?.map(
      (alertPolicy) => new Alert(alertPolicy)
    ) ?? [];
    return this.alerts
  }

  getDataSources(): DataSource[] {
    this.dataSources = this.config.contents[0]?.dataSources?.map(
      (dataSource) => new DataSource(dataSource)
    ) ?? [];
    return this.dataSources
  }

  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    this.configPath =`dashboards/${this.name}`;
    return this.configPath
  }

  /**
   * Read and parse a JSON file
   * @param filePath - The path to the JSON file
   * @returns - An object containing the path and contents of the file
   */
  getConfigContent() {
    this.config = readQuickstartFile<QuickstartConfig>(this.configPath)
    return this.config
  }

  /**
   * TODO: implement validation
   */
  validate() {
    this.isValid = true;
    return true;
  }
}

export default Quickstart;

