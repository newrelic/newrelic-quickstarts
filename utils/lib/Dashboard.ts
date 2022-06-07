import Component from './Component';
import { readQuickstartFile } from '../helpers';
import * as fs from 'fs'
import * as path from 'path';
import type { QuickstartDashboardInput } from '../types/QuickstartMutationVariable'

class Dashboard extends Component<QuickstartDashboardInput> {
  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    this.configPath = `dashboards/${this.name}`;
    return this.configPath
  }

  /**
   * Read and parse a JSON file
   * @param filePath - The path to the JSON file
   * @returns - An object containing the path and contents of the file
   */
  getConfigContent() {
    this.config = readQuickstartFile<QuickstartDashboardInput>(this.configPath)
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

export default Dashboard;
