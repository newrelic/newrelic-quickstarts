import Component from './Component'
import type { QuickstartDashboardInput } from '../types/QuickstartMutationVariable'
import * as fs from 'fs'
import * as path from 'path';

class Dashboard extends Component<QuickstartDashboardInput> {

  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    return `dashboards/${this.name}`
  }
  
  /**
   * TODO: same code as 'readJsonFile' in 'helpers' - add JSDoc
   */
  getConfigContent() {
    const buffer: Buffer = fs.readFileSync(
      path.resolve(__dirname, '..', '..', this.configPath)
    );
    const contents: QuickstartDashboardInput = JSON.parse(buffer.toString('utf-8'));
    return contents 
  }

  /**
   * TODO: implement validation
   */
  validate() {
    this.isValid = true
    return true
  }

}

export default Dashboard;
