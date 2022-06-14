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
  getConfigFilePath(): string {
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
  getConfigContent(): DashboardConfig {
    if (!this.isValid) {
      return this.config;
    }

    const file = fs.readFileSync(this.fullPath);
    return JSON.parse(file.toString('utf-8'));
  }

  /**
   * Get mutation variables from dashboard config
   * @returns - mutation variables for dashboard.
   */
  getMutationVariables(): QuickstartDashboardInput {
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

  /**
   * Grabs the paths for screenshots associated with dashboard
   * @returns - An array of filepaths to screenshots 
   */
  getScreenshotPaths(): string[] {
    const splitConfigPath = path.dirname(this.fullPath);
    const globPattern = `${splitConfigPath}/*.+(jpeg|jpg|png)`;

    return glob.sync(globPattern);
  }

  /**
   * Constructs the url to screenshot based off raw github URL
   * for a dashboard's mutation variable
   * @returns - Object with URL for the mutation variable
   */
  getScreenshotUrl(screenshotPath: string): { url: string } {
    const splitConfigPath = path.dirname(this.configPath);
    const screenShotFileName = path.basename(screenshotPath);

    return {
      url: `${GITHUB_RAW_BASE_URL}/${splitConfigPath}/${screenShotFileName}`,
    };
  }

  /**
   * Static method that returns a list of every dashboard
   * @returns - A list of all dashboards
   */
  static getAll(): Dashboard[] {
    return glob.sync(path.join(__dirname, '..', '..', 'dashboards', '*', '*.+(json)'))
      .map((dashboardPath) => path.dirname(dashboardPath.split('dashboards/')[1]))
      .map((localPath) => new Dashboard(localPath))
  }
}

export default Dashboard;
