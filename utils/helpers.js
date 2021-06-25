'use strict';
const fs = require("fs");
const path = require('path');
const isImage = require('is-image');
const glob = require('glob');

const isDirectory = (dir) =>
  fs.statSync(dir).isDirectory();

/** 
* Counts the number of image files in a folder
* @param {string} folder - The folder to count the image files from
* @returns {number} The number of image type files in the folder
*/
const getImageCount = (folder) => {
  return [...glob.sync(path.resolve(folder, '**/*'))]
    .filter(file => isImage(file)).length
}


/** 
* Gets the size of a file in Bytes
* @param {string} file - The file to get the size of
* @returns {Array} The file size in Bytes 
*/
const getFileSize = (file) => {
  return fs.statSync(file)['size']
}

/** 
* Parses the file extension type from a file path
* @param {string} file - The file path to parse an extension from
* @returns {string} The extension of the file
*/
const getFileExtension = (file) => {
  return path.extname(file)
}

/** 
* Gets an array of all files and directories in a path
* @param {string} dir - The directory to parse, set by the BASE_PATH variable
* @returns {Array} An array of pathnames of a globbed directory
*/
const globFiles = (dir) => {
  const globbedFiles = [...glob.sync(path.resolve(dir, '**/*'))]
  return globbedFiles
}

module.exports = { getImageCount, getFileSize, getFileExtension, globFiles, isDirectory };