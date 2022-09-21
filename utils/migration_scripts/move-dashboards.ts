import * as fs from 'fs';
import * as glob from 'glob';
import * as path from 'path';

import { RmDirOptions } from 'fs';

interface Dashboard {
  name: string;
  description: string | null;
  pages: any;
}

export interface DashboardFileAndPath {
  path: string;
  contents: Dashboard[];
}

/**
 * Finds the path to all top level quickstart configs
 * @param componentType - The type of component
 * @returns - An array of the file paths
 */
export const findQuickstartComponentConfiguration = (
  componentType: 'dashboards' | 'alerts'
): string[] => {
  const ext = componentType === 'dashboards' ? 'json' : '+(yml|yaml)';
  return glob.sync(
    path.resolve(
      process.cwd(),
      `../quickstarts/**/${componentType}/**/*.${ext}`
    )
  );
};

/**
 * Wrapper function retreives all dashboard paths in the top level
 * of `dashboards/`.
 * @returns - Array of file paths to all dashboards in `dashboards/`
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
  const file = fs.readFileSync(dashFilePath);
  const contents = JSON.parse(file.toString('utf-8'));
  return { path: dashFilePath, contents: [contents] };
};

/**
 * Gets the unique base quickstart directory from a given file path.
 * e.g. filePath: 'quickstarts/python/aiohttp/alerts/ApdexScore.yml' + targetChild: 'alerts' = 'python/aiohttp'.
 * @param filePath - Full file path of a file in a quickstart.
 * @param targetChild - Node in file path that should be preceded by a base quickstart directory.
 * @returns - Node in file path of the quickstart.
 */
const getQuickstartNode = (
  filePath: string,
  targetChild: string = ''
): string => {
  const splitFilePath = filePath.split('/');

  const baseQuickstartDirectoryIndex = splitFilePath.indexOf(targetChild) - 1;

  let uniqueQuickstartDirectory = splitFilePath[baseQuickstartDirectoryIndex];
  let indexCounter = baseQuickstartDirectoryIndex;

  while (indexCounter > 1) {
    uniqueQuickstartDirectory = splitFilePath[indexCounter - 1].concat(
      `/${uniqueQuickstartDirectory}`
    );
    indexCounter--;
  }
  return uniqueQuickstartDirectory;
};

/**
 * Identifies where in a given file path to look for a quickstart directory.
 * @param filePath - Full file path of a file in a quickstart.
 * @return Called function with arguments to determine the quickstart of a given file path.
 */
export const getQuickstartFromFilename = (
  filePath: string
): string | undefined => {
  if (!filePath.includes('quickstarts/')) {
    return undefined;
  }

  if (filePath.includes('/alerts/')) {
    return getQuickstartNode(filePath, 'alerts');
  }

  if (filePath.includes('/dashboards/')) {
    return getQuickstartNode(filePath, 'dashboards');
  }

  if (filePath.includes('/images/')) {
    return getQuickstartNode(filePath, 'images');
  }

  const targetChildNode = filePath.split('/').pop();

  return getQuickstartNode(filePath, targetChildNode);
};

/**
 * Function handles creating an object that groups duplicate and unique
 * dashboards to their respective key.
 *
 * `key: dashboard pages`
 * @param dashboards - Array of FilePathAndContents
 * @returns - 2D array of grouped dashboard paths
 */
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

/**
 * Function creates a `dashboards/` directory if one does not exist
 * in the file system
 */
const setupDashboardDir = () => {
  const dashboardDirPath = path.resolve(__dirname, '../..', 'dashboards');
  if (!fs.existsSync(dashboardDirPath)) {
    fs.mkdirSync(dashboardDirPath);
  }
};

/**
 * Function handles creating a new dashboard location that points
 * to the top level of the `dashboards/` directory.
 * @param currentDashLocation - The path of the dashboard
 * @returns - The new dashboard location to the top level of `dashboards/`
 */
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
  // if already exists, suffix new dashboard directory name with quickstart dirname
  if (fs.existsSync(newDashboardLocation)) {
    const quickstartLocation = getQuickstartFromFilename(currentDashLocation)
      ?.split('/quickstarts/')
      .pop()
      ?.replace(/\//g, '-');

    newDashboardLocation = `${newDashboardLocation}-${quickstartLocation}`;
  }
  return newDashboardLocation;
};

/**
 * Function handles creating a new dashbord location and copying the dashboard
 * from `quickstarts/` to `dashboards/`.
 *
 * @param newDashboardLocation - The new path to the top level of `dashboards/`
 * @param currentDashboardLocation - The old path to the dashboard in `quickstarts/`
 */
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

type DirectoryAndDashTuple = [string, string[]][];

/**
 * Function handles updating quickstart config files and
 * remove associated dashboard directories in quickstart
 * @param dirAndDashTuples - Array of tuples containing quickstart dir
 *  and new dashboards to append to config
 */
const updateQuickstarts = (dirAndDashTuples: DirectoryAndDashTuple) => {
  dirAndDashTuples.forEach(([quickstartDir, newDashboards]) => {
    const filePaths = glob.sync(path.join('/', quickstartDir, 'config.*'));
    if (!Array.isArray(filePaths) || filePaths.length === 0) {
      return;
    }

    const configFilePath = filePaths.pop();

    // get the new dashboard location
    const newDashboardLocations = newDashboards.map((dashPath: string) =>
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
  });
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

  // loop through all the quickstarts that need to be updated
  updateQuickstarts(Object.entries(quickstartToUpdate));
};

if (require.main === module) {
  main();
}
