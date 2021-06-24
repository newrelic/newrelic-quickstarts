'use strict';
const core = require('@actions/core');
const fs = require("fs");
const path = require('path');
const isImage = require('is-image');
const glob = require('glob');


const BASE_PATH = './packs/';
const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 6;
const ALLOWED_IMG_EXT = [
  '.png',
  '.jpeg',
  '.jpg',
  '.svg',
];
let valid = true,
    sizeErrors = [],
    typeErrors = [],
    tooManyImages = [];
    
/** 
* Validates an object against a JSON schema
* @param {String} dir - The directory to parse, set by the BASE_PATH variable
*/

const globFiles = (dir) => {
  const entries = [...glob.sync(path.resolve(dir, '**/*'))]
  // Get files within the current directory and add a path key to the file objects
  const files = entries
      .filter(file => isImage(file))
      .map(file => {
        const fileExt = path.extname(file);
        if (!ALLOWED_IMG_EXT.includes(fileExt)){
          typeErrors = [...typeErrors, file]
          valid = false
        }

        const fileSize = fs.statSync(file)['size']
        if (fileSize > MAX_SIZE){
            sizeErrors = [...sizeErrors, {[file]: `${fileSize/1000000}MB`}]
            valid = false
        }
      })
  
  const directories = entries
    .filter(file => fs.statSync(file).isDirectory())
    .map(folder => {
      const imageCount = [...glob.sync(path.resolve(folder, '**/*'))]
        .filter(file => isImage(file)).length
      if (imageCount > MAX_NUM_IMG) {
          tooManyImages = [...tooManyImages, {[folder]: imageCount}]
          valid = false;
      }
    })
}

const main = () => {
  globFiles(BASE_PATH)

  if(!valid) {
      if (typeErrors.length > 0) {
        console.warn(`\nImages should be of format ${[...ALLOWED_IMG_EXT]}:`)
        typeErrors.map((file) => console.warn(file))
      }
      if (sizeErrors.length > 0) {
        console.warn(`\nImages should be below ${MAX_SIZE/1000000}MB:`)
        sizeErrors.map((file) => console.warn(file))
      }
      if (tooManyImages.length > 0) {
        console.warn(`\nComponents should contain less than 6 images:`)
        tooManyImages.map((dir) => console.warn(dir))
      }
      core.setFailed('Check image requirements!')
  }  
}

main();
