import {
  getAllDashboardPaths,
  getDashboardScreenshotsPath,
  readDashboardFile,
  DashboardFileAndPath,
} from '../lib/dashboards';

import { getQuickstartFromFilename } from '../helpers';

import * as path from 'path';
import * as fs from 'fs';

import { RmDirOptions } from 'fs';
import * as glob from 'glob';

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
    fs.mkdirSync(dashboardDirPath);
  }
};

const getNewDashboardLocation = (currentDashLocation: string) => {
  const dashLocation = path.dirname(currentDashLocation).split('/').pop()!;
  // cleanup file path name
  const cleanedDashLocation = dashLocation.replace(/_/g, '-').toLowerCase();
  // create new dashboard directory
  let newDashboardLocation = path.resolve(
    __dirname,
    '../..',
    'dashboards',
    cleanedDashLocation
  );
  // if already exists, suffix directory name with quickstart slug
  if (fs.existsSync(newDashboardLocation)) {
    const quickstartLocation = getQuickstartFromFilename(currentDashLocation)
      ?.split('/quickstarts/')
      .pop()
      ?.replace(/\//g, '-');

    newDashboardLocation = `${newDashboardLocation}-${quickstartLocation}`;
  }
  return newDashboardLocation;
};

const copyFiles = (
  newDashboardLocation: string,
  currentDashboardLocation: string
) => {
  fs.mkdirSync(newDashboardLocation);
  fs.copyFileSync(
    currentDashboardLocation,
    path.join(newDashboardLocation, path.basename(currentDashboardLocation))
  );
};

const main = () => {
  setupDashboardDir();
  const paths = getAllDashboardPaths();

  const dashboardsAndPaths = paths.map(readDashboardFile);
  const grouped = groupDuplicates(dashboardsAndPaths);

  const quickstartToUpdate: Record<string, string[]> = {};

  grouped.forEach((group) => {
    // determine new location for dashboard
    const currentDashboardLocation = group[0].path;
    const newDashboardLocation = getNewDashboardLocation(
      currentDashboardLocation
    );
    copyFiles(newDashboardLocation, currentDashboardLocation);

    // get all dashboard files (screenshots)
    const dashboardScreenshotPaths: string[] = getDashboardScreenshotsPath(
      currentDashboardLocation
    );
    const dashboardScreenshots = dashboardScreenshotPaths.map((screenshot) => {
      return {
        oldFilePath: screenshot,
        newFilePath: path.join(newDashboardLocation, path.basename(screenshot)),
      };
    });
    // create new files in this location
    dashboardScreenshots.forEach(({ oldFilePath, newFilePath }) =>
      fs.copyFileSync(oldFilePath, newFilePath)
    );

    // loop over all the dashboards in this group and get the quickstart path for each
    group
      .map((dashboard) => {
        return getQuickstartFromFilename(dashboard.path)!;
      })
      .forEach((quickstartDir) => {
        // save a reference to the new dashboard location for each quickstart
        if (!quickstartToUpdate[quickstartDir]) {
          quickstartToUpdate[quickstartDir] = [];
        }

        quickstartToUpdate[quickstartDir].push(newDashboardLocation);
      });
  });

  // loop through all the quickstarts

  Object.entries(quickstartToUpdate).forEach(([quickstartDir, newDashboards]) => {
    const filePaths = glob.sync(path.join('/', quickstartDir, 'config.*'));
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return;
    }

    const configFilePath = filePaths.pop();

    // get the new dashboard location
    const newDashboardLocations = newDashboards.map((dashPath) =>
      path.basename(dashPath)
    );

    // update the quickstart config
    const rawConfig = fs.readFileSync(configFilePath!, { encoding: 'utf-8' });

    const updatedRawConfig = rawConfig.concat(
      '\n',
      'dashboards:',
      '\n  - ',
      newDashboardLocations.join('\n  - ')
    );

    // update impacted quickstart config file to add dashboard IDs
    fs.writeFileSync(configFilePath!, updatedRawConfig, 'utf-8'); 


    // delete the dashboard directory
    fs.rmdirSync(path.join('/', quickstartDir, 'dashboards/'), {
      recursive: true,
      force: true,
    } as RmDirOptions);
  })

};

main();
