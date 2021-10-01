'use strict';
const core = require('@actions/core');
const isImage = require('is-image');
const {
  getFileSize,
  getFileExtension,
  globFiles,
  readQuickstartFile,
  findMainQuickstartConfigFiles,
} = require('./helpers');

const glob = require('glob');
const path = require('path');
const BASE_PATH = '../quickstarts/';
const DASHBOARD_IMAGES_PATH = '/images/';
const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 6;
const ALLOWED_IMG_EXT = ['.png', '.jpeg', '.jpg', '.svg'];

/**
 * Validate all folders contain no more than MAX_NUM_IMG images
 * @param {Array} files - The array of globbed file names
 */

const validateImageCounts = (quickstartDirs) => {
  const directories = quickstartDirs
    .map((quickstart) => {
      const quickstartDirName = path.dirname(quickstart);
      // get all images for a quickstart
      const imagePaths = glob.sync(
        path.resolve(quickstartDirName, '**/*.+(png|jpeg|jpg|svg)')
      );
      const quickstartConfig = readQuickstartFile(quickstart).contents[0];
      const iconPath = quickstartConfig.icon
        ? path.resolve(quickstartDirName, quickstartConfig.icon)
        : null;
      const logoPath = quickstartConfig.logo
        ? path.resolve(quickstartDirName, quickstartConfig.logo)
        : null;

      const screenshotPaths = imagePaths.filter(
        (p) => p !== iconPath && p !== logoPath && !p.includes(DASHBOARD_IMAGES_PATH)
      );

      const dashboardImagePaths = imagePaths.filter(
        (p) => p !== iconPath && p !== logoPath && p.includes(DASHBOARD_IMAGES_PATH)
      );
      
      if (screenshotPaths.length > MAX_NUM_IMG) {
        return {
          folder: quickstartDirName,
          imageCount: screenshotPaths.length,
        };
      }

      if (dashboardImagePaths.length > MAX_NUM_IMG) {
        return {
          folder: quickstartDirName + DASHBOARD_IMAGES_PATH,
          imageCount: dashboardImagePaths.length,
        };
      }
    })
    .filter(Boolean);

  if (directories.length) {
    core.setFailed('Components should contain less than 6 images');
    console.warn(`\nPlease check the following directories:`);
    directories.map((dir) => console.warn(dir));
  }
};

/**
 * Validates that files are below MAX_SIZE
 * @param {Array} globbedFiles - The array of globbed file names
 */
const validateFileSizes = (globbedFiles) => {
  const sizes = globbedFiles
    .filter((file) => isImage(file))
    .filter((file) => {
      return getFileSize(file) > MAX_SIZE;
    })
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
 * @param {Array} globbedFiles - The array of globbed file names
 */
const validateImageExtensions = (globbedFiles) => {
  const extensions = globbedFiles
    .filter((file) => isImage(file))
    .filter((file) => {
      return !ALLOWED_IMG_EXT.includes(getFileExtension(file));
    });
  if (extensions.length > 0) {
    core.setFailed(`Images should be of format ${[...ALLOWED_IMG_EXT]}:`);
    console.warn(`\nPlease check the following images:`);
    extensions.map((file) => console.warn(file));
  }
};

const main = () => {
  const quickstartDirs = findMainQuickstartConfigFiles();
  validateImageCounts(quickstartDirs);

  const globbedFiles = globFiles(BASE_PATH);
  validateFileSizes(globbedFiles);
  validateImageExtensions(globbedFiles);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}

module.exports = {
  validateImageCounts,
  validateImageExtensions,
  validateFileSizes,
};
