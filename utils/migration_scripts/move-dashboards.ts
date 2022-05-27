import {
  getAllDashboardPaths,
  getDashboardScreenshotsPath,
  readDashboardFile,
  DashboardFileAndPath,
} from '../lib/dashboards';

import { getQuickstartFromFilename } from '../helpers';

import * as path from 'path';
import * as fs from 'fs';

const groupDuplicates = (
  dashboards: DashboardFileAndPath[]
): DashboardFileAndPath[][] => {
  // [stringified contents of `pages`] => dashboardAndPath
  const dupBuckets: Record<string, DashboardFileAndPath[]> = {};
  for (const dashAndPath of dashboards) {
    const dash = dashAndPath.contents[0];
    const dashKey = JSON.stringify(dash.pages);

    if (!Array.isArray(dupBuckets[dashKey])) {
      dupBuckets[dashKey] = [];
    }

    dupBuckets[dashKey].push(dashAndPath);
  }

  return Object.values(dupBuckets);
};

const setupDashboardDir = () => {
  const dashboardDirPath = path.resolve(__dirname, '../..', 'dashboards');
  if (!fs.existsSync(dashboardDirPath)) {
    fs.mkdirSync(dashboardDirPath)
  }
}

const getFullDashboardPath = (currentDashLocation: string) => {
  const newDashLocation = path.dirname(currentDashLocation).split('/').pop()!;
  // cleanup file path name
  const cleanedDashLocation = newDashLocation.replace(/_/g, '-').toLowerCase();
  // create new dashboard directory
  let fullDashboardPath = path.resolve(
    __dirname,
    '../..',
    'dashboards',
    cleanedDashLocation
  );
  // if already exists, suffix directory name with quickstart slug
  if (fs.existsSync(fullDashboardPath)) {
    const quickstartLocation = getQuickstartFromFilename(currentDashLocation)
      ?.split('/quickstarts/')
      .pop()
      ?.replace(/\//g, '-');

    fullDashboardPath = fullDashboardPath + '-' + quickstartLocation;
  }
  return fullDashboardPath;
}

const copyFiles = (fullDashboardLocation: string, currentDashboardLocation: string) => {
    fs.mkdirSync(fullDashboardLocation)
    fs.copyFileSync(
      currentDashboardLocation,
      path.join(fullDashboardLocation, path.basename(currentDashboardLocation))
    );
}

const main = () => {
  setupDashboardDir();
  const paths = getAllDashboardPaths();

  const dashboardsAndPaths = paths.map(readDashboardFile);
  const grouped = groupDuplicates(dashboardsAndPaths);
  // console.log(grouped);

  grouped.forEach(group => {
    // determine new location for dashboard
    const currentDashboardLocation = group[0].path
    const fullDashboardLocation = getFullDashboardPath(currentDashboardLocation);
    copyFiles(fullDashboardLocation, currentDashboardLocation);

    // get all dashboard files (screenshots)
    const dashboardScreenshotPaths: string[] = getDashboardScreenshotsPath(currentDashboardLocation);
    const dashboardScreenshots = dashboardScreenshotPaths.map((screenshot) => {
      return {
        oldFilePath: screenshot,
        newFilePath: path.join(fullDashboardLocation, path.basename(screenshot))
      }
    })
    // create new files in this location
    dashboardScreenshots.forEach(({ oldFilePath, newFilePath }) =>
      fs.copyFileSync(oldFilePath, newFilePath)
    );

    // loop through group 
    //    update each quickstart config to reference the new location of dashboard
    //    delete old dashboard files
    //    
  })

  // attempt to read all dashboards again and ensure there are no loose ends
};

main();
