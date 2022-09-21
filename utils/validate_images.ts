import * as core from '@actions/core';
import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import Dashboard from './lib/Dashboard';

type DirectoryValidation = {
  folder: string;
  imageCount: number;
  maxImages: number;
};

const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 12;
const ALLOWED_IMG_EXT = ['.png', '.jpeg', '.jpg', '.svg'];

/**
 * Gets the size of a file in Bytes
 * @param filePath - The file to get the size of.skip
 * @returns - The file size in Bytes
 */
export const getFileSize = (filePath: string): number => {
  return fs.statSync(filePath)['size'];
};

/**
 * Validate all dashboard folders contain no more than MAX_NUM_IMG images
 */
export const validateImageCounts = (dashboards: Dashboard[]): void => {
  const imagesDirectories: DirectoryValidation[] = [];
  dashboards.forEach((dashboard) => {
    const dashboardDirName = path.dirname(dashboard.configPath);

    const dashboardImagePaths = glob
      .sync(path.join(__dirname, '..', dashboardDirName, '*.!(json)'))
      .filter((filePath) => ALLOWED_IMG_EXT.includes(path.extname(filePath)));

    // Each dashboard is allowed MAX_NUM_IMG dashboards
    if (dashboardImagePaths.length > MAX_NUM_IMG) {
      imagesDirectories.push({
        folder: dashboardDirName,
        imageCount: dashboardImagePaths.length,
        maxImages: MAX_NUM_IMG,
      });
    }
  });

  if (imagesDirectories.length) {
    core.setFailed(
      'Each dashboard component should contain no more than 12 screenshots'
    );
    console.warn(`\nPlease check the following directories:`);
    imagesDirectories.forEach((dir: DirectoryValidation) => console.warn(dir));
  }
};

/**
 * Validates that files are below MAX_SIZE
 */
export const validateFileSizes = (globbedFiles: string[]): void => {
  const sizes = globbedFiles
    .filter((file) => ALLOWED_IMG_EXT.includes(path.extname(file)))
    .filter((file) => getFileSize(file) > MAX_SIZE)
    .map((file) => {
      return {
        file,
        size: `${getFileSize(file) / 1000000}MB`,
      };
    });
  if (sizes.length > 0) {
    core.setFailed(`Images should be under ${MAX_SIZE / 1000000}MB:`);
    console.warn(`\nPlease check the following images:`);
    sizes.map((file) => console.warn(file));
  }
};

/**
 * Validates images are one of the ALLOWED_IMG_EXT
 */
export const validateImageExtensions = (globbedFiles: string[]): void => {
  const extensions = globbedFiles.filter(
    (file) => !ALLOWED_IMG_EXT.includes(path.extname(file))
  );
  if (extensions.length > 0) {
    core.setFailed(`Images should be of format ${[...ALLOWED_IMG_EXT]}:`);
    console.warn(`\nPlease check the following images:`);
    extensions.map((file) => console.warn(file));
  }
};

const main = () => {
  const dashboards = Dashboard.getAll();

  validateImageCounts(dashboards);

  const globbedFiles = glob.sync(
    path.resolve(__dirname, '..', 'dashboards', '*', '*.!(json)')
  );
  validateFileSizes(globbedFiles);
  validateImageExtensions(globbedFiles);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_images.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
