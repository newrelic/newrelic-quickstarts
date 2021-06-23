'use strict';
const core = require('@actions/core');
const {promises:fs, statSync} = require("fs");
const path = require('path');
const isImage = require('is-image');

const BASE_PATH = './packs/';
const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 1;
const ALLOWED_IMG_EXT = [
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
* @param {String} dir - The directory to parse, set by the command line argument
* @returns {Object[]} An array of any errors found
*/
async function getFiles(dir) {
  
  const entries = await fs.readdir(dir, { withFileTypes: true });

  // Get files within the current directory and add a path key to the file objects
  const files = entries
      .filter(file => !file.isDirectory())
      .filter(file => isImage(dir + file.name))
      .map(file => {
        // console.log(file.name)
        const filePath = dir + file.name
        const fileExt = path.extname(filePath);
        const fileSize = statSync(filePath)['size']
        if (fileSize < MAX_SIZE){
            sizeErrors.push({[filePath]: `${fileSize/1000000}MB`})
            valid = false
        }
        if (!ALLOWED_IMG_EXT.includes(fileExt)){
            typeErrors.push(filePath)
            valid = false
        }
      })

  if (files.length > MAX_NUM_IMG) {
      tooManyImages.push({[dir]: files.length});
      valid = false;
  }
  // Get folders within the current directory
  const folders = entries.filter(folder => folder.isDirectory());
  
  for (const folder of folders)
      /*
        Add the found files within the subdirectory to the files array by calling the
        current function itself
      */
    
      files.push(...await getFiles(`${dir}${folder.name}/`));
  return;
}

const main = () => {
 getFiles(BASE_PATH).then(() => {
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
  }).catch(e => core.setFailed(e))
  
}

main();
