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

const main = () => {
  setupDashboardDir();
  const paths = getAllDashboardPaths();

  const dashboardsAndPaths = paths.map(readDashboardFile);
  const grouped = groupDuplicates(dashboardsAndPaths);
  // console.log(grouped);

  grouped.forEach(group => {
    // determine new location for dashboard
    const currentDashLocation = group[0].path;
    const newDashLocation = path.dirname(currentDashLocation).split('/').pop()!;
    // cleanup file path name 
    const cleanedDashLocation = newDashLocation.replace(/_/g, "-").toLowerCase();
    // create new dashboard directory
    let fullDashboardPath = path.resolve(__dirname, '../..', 'dashboards', cleanedDashLocation);
    // if already exists, suffix directory name with quickstart slug
    if (fs.existsSync(fullDashboardPath)) {
      const quickstartLocation = getQuickstartFromFilename(currentDashLocation)?.split("/quickstarts/").pop()?.replace(/\//g, "-");

      fullDashboardPath = fullDashboardPath + "-" + quickstartLocation;
    }
    fs.mkdirSync(fullDashboardPath)
    console.log(fullDashboardPath)
    // get all dashboard files (screenshots)
    // create new files in this location

    // loop through group 
    //    update each quickstart config to reference the new location of dashboard
    //    delete old dashboard files
    //    
  })
};

main();
