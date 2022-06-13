import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

import type { QuickstartDashboardInput } from '../types/QuickstartMutationVariable';

import Component from './Component';
import { GITHUB_RAW_BASE_URL } from '../constants';
import { getAssetSourceUrl, removeRepoPathPrefix } from './helpers';

interface DashboardConfig {
  name: string;
  description?: string;
  pages: any;
}

class Dashboard extends Component<DashboardConfig, QuickstartDashboardInput> {
  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    const filePaths = glob.sync(
      path.join(this.basePath, 'dashboards', this.localPath, '*.json')
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      return ``;
    }

    return removeRepoPathPrefix(filePaths[0]);
  }

  /**
   * Read and parse a JSON file
   * @returns - The contents of the file
   */
  getConfigContent() {
    if (!this.isValid) {
      return this.config;
    }

    const file = fs.readFileSync(this.fullPath);
    return JSON.parse(file.toString('utf-8'));
  }

  getMutationVariables() {
    const { name, description } = this.config;
    const screenshotPaths = this.getScreenshotPaths();

    return {
      description: description && description.trim(),
      displayName: name && name.trim(),
      rawConfiguration: JSON.stringify(this.config),
      sourceUrl: getAssetSourceUrl(this.configPath),
      screenshots:
        screenshotPaths && screenshotPaths.map((s) => this.getScreenshotUrl(s)),
    };
  }

  getScreenshotPaths() {
    const splitConfigPath = path.dirname(this.fullPath);
    const globPattern = `${splitConfigPath}/*.+(jpeg|jpg|png)`;

    return glob.sync(globPattern);
  }

  getScreenshotUrl(screenshotPath: string) {
    const splitConfigPath = path.dirname(this.configPath);
    const screenShotFileName = path.basename(screenshotPath);

    return {
      url: `${GITHUB_RAW_BASE_URL}/${splitConfigPath}/${screenShotFileName}`,
    };
  }

  static getAll() {

    return glob.sync(path.join(__dirname, '..', '..', 'dashboards', '*', '*.+(json)'))
      .map((dashboardPath) => path.dirname(dashboardPath.split('dashboards/')[1]))
      .map((localPath) => new Dashboard(localPath))



  }
}

export default Dashboard;
