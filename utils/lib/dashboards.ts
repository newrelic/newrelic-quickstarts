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

export const getAllDashboardPaths = () => {
  return findQuickstartComponentConfiguration('dashboards');
};

// .sjon
// .png
// assets/iconm.svg
export const getDashboardScreenshotsPath = (dashFilePath: string): string[] => {
  const dashDir = path.dirname(dashFilePath);
  return glob.sync(path.resolve(dashDir, '*.!(json)'));
};

export const readDashboardFile = (
  dashFilePath: string
): DashboardFileAndPath => {
  const dashFile = readJsonFile<Dashboard>(dashFilePath);
  return dashFile;
};
