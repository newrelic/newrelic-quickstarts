import * as glob from 'glob';
import * as path from 'path';
import {
  findQuickstartComponentConfiguration,
  FilePathAndContents,
  readJsonFile,
} from '../helpers';

interface Dashboard {
  name: string;
  description: string | null;
  pages: any;
}

export type DashboardFileAndPath = FilePathAndContents<Dashboard>;

/**
 * Wrapper function retreives all dashboard paths in the top level
 * of `quickstarts/`.
 * @returns - Array of file paths to all dashboards in `quickstarts/`
 */
export const getAllDashboardPaths = (): string[] => {
  return findQuickstartComponentConfiguration('dashboards');
};

/**
 * Lib function fetches all file paths related to a dashboard that
 * are assets to the dashboard itself. This does not include 
 * JSON files.
 * @param dashFilePath - absolute file path to dashboard directory.
 * @returns - Array of file paths of assets to a dashboard
 */
export const getDashboardScreenshotsPath = (dashFilePath: string): string[] => {
  const dashDir = path.dirname(dashFilePath);
  return glob.sync(path.resolve(dashDir, '*.!(json)'));
};

/**
 * Wrapper function reads the contents of a dashboard
 * config file.
 * @param dashFilePath - file path of dashboard config file 
 * @returns - An object containing path and content of a dashboard config file.  
 */
export const readDashboardFile = (
  dashFilePath: string
): DashboardFileAndPath => {
  const dashFile = readJsonFile<Dashboard>(dashFilePath);
  return dashFile;
};
