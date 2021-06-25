'use strict';
const core = require('@actions/core');
const fs = require("fs");
const isImage = require('is-image');
const { 
  getImageCount, 
  getFileSize, 
  getFileExtension, 
  globFiles,
  isDirectory
} = require('./helpers');

const BASE_PATH = './packs/';
const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 6;
const ALLOWED_IMG_EXT = [
  '.png',
  '.jpeg',
  '.jpg',
  '.svg',
];

/** 
* Validate all folders contain no more than MAX_NUM_IMG images
* @param {Array} files - The array of globbed file names
* @returns {Array} An array of objects that include directories with more than MAX_NUM_IMG and the image count 
*/
const checkImageCounts = (files) => {
  const directories = files
    .filter(file => isDirectory(file))
    .filter(folder => {
      return getImageCount(folder) > MAX_NUM_IMG
    })
    .map((folder) => {
      return {[folder]: getImageCount(folder)};
    });
  return directories
}

/** 
* Validates that files are below MAX_SIZE
* @param {Array} globbedFiles - The array of globbed file names
* @returns {Array} An array of objects that include files over MAX_SIZE and their size in MegaBytes 
*/
const checkFileSizes = (globbedFiles) => {
  const sizes = globbedFiles
    .filter(file => isImage(file))
    .filter(file => {
      return getFileSize(file) < MAX_SIZE
    })
    .map(file => {
      return {[file]: `${getFileSize(file)/1000000}MB`}
    })
  return sizes
}

/** 
* Validates images are one of the ALLOWED_IMG_EXT
* @param {Array} globbedFiles - The array of globbed file names
* @returns {Array} An array of objects that include files not in ALLOWED_IMG_EXT
*/
const checkImageExtensions = (globbedFiles) => {
  const extensions = globbedFiles
    .filter(file => isImage(file))
    .filter(file => {
      return !ALLOWED_IMG_EXT.includes(getFileExtension(file))
    })
  return extensions
}

const main = () => {
  let valid = true;
  const globbedFiles = globFiles(BASE_PATH)
  const imageCounts = checkImageCounts(globbedFiles)
  const fileSizes = checkFileSizes(globbedFiles)
  const imageExtensions = checkImageExtensions(globbedFiles)

  if (imageExtensions.length > 0) {
    console.warn(`\nImages should be of format ${[...ALLOWED_IMG_EXT]}:`)
    imageExtensions.map((file) => console.warn(file))
    valid = false
  }

  if (fileSizes.length > 0) {
    console.warn(`\nImages should be under ${MAX_SIZE/1000000}MB:`)
    fileSizes.map((file) => console.warn(file))
    valid = false
  }

  if (imageCounts.length > 0) {
    console.warn(`\nComponents should contain less than 6 images:`)
    imageCounts.map((dir) => console.warn(dir))
    valid = false
  }

  if(!valid) {
    core.setFailed('Check image requirements!')
  }  
}

if (require.main === module) {
  main();
}

module.exports = main;
