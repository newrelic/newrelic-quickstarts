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
const MAX_NUM_IMG = 12;
const ALLOWED_IMG_EXT = ['.png', '.jpeg', '.jpg', '.svg'];

type DirectoryValidation = {
  folder: string;
  dashboardCount: number;
  imageCount: number;
  maxImages: number;
};

/**
 * Validate all folders contain no more than MAX_NUM_IMG images
 * @param {Array} files - The array of globbed file names
 */

const validateImageCounts = (quickstartDirs: string[]): void => {
  const screenshotDirectories: DirectoryValidation[] = [];
  const imagesDirectories: DirectoryValidation[] = [];
  console.log('quickstartDirs: ', quickstartDirs);
  quickstartDirs.forEach((quickstart: any) => {
    const quickstartDirName = path.dirname(quickstart);
    // get all images for a quickstart
    const imagePaths = glob.sync(
      path.resolve(quickstartDirName, 'dashboards/**/*.+(png|jpeg|jpg|svg)')
    );
    const quickstartConfig = readQuickstartFile(quickstart).contents[0];
    const quickstartName = quickstartConfig.name;
    const logoPath = quickstartConfig.logo
      ? path.resolve(quickstartDirName, quickstartConfig.logo)
      : null;

    // Max images is per dashboard so we need to account for this by getting the number of dashboards
    const dashboardCount = glob.sync(
      path.resolve(quickstartDirName, 'dashboards/**/*.json')
    ).length;

    const screenshotPaths = imagePaths.filter(
      (p: any) =>
        p !== logoPath && !p.includes(quickstartName + DASHBOARD_IMAGES_PATH)
    );

    const dashboardImagePaths = imagePaths.filter(
      (p: any) =>
        p !== logoPath && p.includes(quickstartName + DASHBOARD_IMAGES_PATH)
    );

    // Each dashboard is allowed MAX_NUM_IMG dashboards
    if (screenshotPaths.length > MAX_NUM_IMG * dashboardCount) {
      screenshotDirectories.push({
        folder: quickstartDirName,
        dashboardCount,
        imageCount: screenshotPaths.length,
        maxImages: MAX_NUM_IMG * dashboardCount,
      });
    }

    if (dashboardImagePaths.length > MAX_NUM_IMG * dashboardCount) {
      imagesDirectories.push({
        folder: quickstartDirName + DASHBOARD_IMAGES_PATH,
        dashboardCount,
        imageCount: dashboardImagePaths.length,
        maxImages: MAX_NUM_IMG * dashboardCount,
      });
    }
  });

  if (screenshotDirectories.length) {
    core.setFailed('Each component should contain no more than 12 screenshots');
    console.warn(`\nPlease check the following directories:`);
    screenshotDirectories.forEach((dir: DirectoryValidation) => console.warn(dir));
  }

  if (imagesDirectories.length) {
    core.setFailed(
      'The `images` directory should contain no more than 12 images per component'
    );
    console.warn(`\nPlease check the following directories:`);
    imagesDirectories.forEach((dir: DirectoryValidation) => console.warn(dir));
  }
};

/**
 * Validates that files are below MAX_SIZE
 * @param {Array} globbedFiles - The array of globbed file names
 */
const validateFileSizes = (globbedFiles: string[]): void => {
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
const validateImageExtensions = (globbedFiles: string[]): void => {
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
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_images.js', or if it was imported.
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
