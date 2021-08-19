'use strict';
const core = require('@actions/core');
const isImage = require('is-image');
const {
  getFileSize,
  getFileExtension,
  globFiles,
  isDirectory,
  findMainPackConfigFiles,
  readPackFile,
} = require('./helpers');

const glob = require('glob');
const fs = require('fs');
const path = require('path');

const BASE_PATH = '../packs/';
const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 6;
const ALLOWED_IMG_EXT = ['.png', '.jpeg', '.jpg', '.svg'];

const isPackDirectory = (dir) => fs.existsSync(path.resolve(dir, 'config.yml'));
// packs/**/(dashboards|alerts)/*.(png|jpeg|jpg|svg)*/

/**
 * Counts the number of image files in a folder
 * @param {string} folder - The folder to count the image files from
 * @returns {number} The number of image type files in the folder
 */
// if image file path matches pack dirname, ignore
const getImageCount = (folder) => {
  return [...glob.sync(path.resolve(folder, '**/*'))].filter((file) =>
    isImage(file)
  ).length;
};

/**
 * Validate all folders contain no more than MAX_NUM_IMG images
 * @param {Array} files - The array of globbed file names
 */
const validateImageCounts = (files) => {
  // get each pack dir
  const packDirs = findMainPackConfigFiles();

  for (const pack of packDirs) {
    // get all images for pack
    const imagePaths = glob.sync(
      path.resolve(path.dirname(pack), '**/*.+(png|jpeg|jpg|svg)')
    );
    const packConfig = readPackFile(pack).contents[0];

    const iconPath = packConfig.icon;
    const logoPath = packConfig.logo;
    if (iconPath && logoPath) {
    }
    const screenshotPaths = imagePaths.filter(
      (p) => p !== iconPath && p !== logoPath
    );

    if (screenshotPaths.length > 6) {
      core.setFailed('Components should contain less than 6 images');
      console.warn(`\nPlease check the following directories:`);
      console.warn(pack);
    }

    // parse config for references to icons or logos
    // remove icon/logo paths from array of all pack images
    // count array
  }
  // const directories = files.filter((file) => isDirectory(file));
  // const packDirs = directories.filter
  //   .filter((file) => isPackDirectory(file))

  //   .filter((folder) => {
  //     return getImageCount(folder) > MAX_NUM_IMG;
  //   })
  //   .map((folder) => {
  //     return {
  //       folder,
  //       imageCount: getImageCount(folder),
  //     };
  //   });
  // if (directories.length > 0) {
  //   core.setFailed('Components should contain less than 6 images');
  //   console.warn(`\nPlease check the following directories:`);
  //   directories.map((dir) => console.warn(dir));
  //  }
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
  const globbedFiles = globFiles(BASE_PATH);
  validateImageCounts(globbedFiles);
  validateFileSizes(globbedFiles);
  validateImageExtensions(globbedFiles);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_packs.js', or if it was imported.
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
