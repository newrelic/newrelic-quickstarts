import Component from './Component'
import { readQuickstartFile } from '../helpers';
import type { QuickstartAlertInput } from '../types/QuickstartMutationVariable'

class Alert extends Component<QuickstartAlertInput> {
  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    this.configPath = `alert-policies/${this.name}`;
    return this.configPath;
  }

  /**
   * Read and parse a JSON file
   * @param filePath - The path to the JSON file
   * @returns - An object containing the path and contents of the file
   */
  getConfigContent() {
    this.config = readQuickstartFile<QuickstartAlertInput>(this.configPath);
    return this.config;
  }

  /**
   * TODO: implement validation
   */
  validate() {
    this.isValid = true;
    return true;
  }
}

export default Alert;

