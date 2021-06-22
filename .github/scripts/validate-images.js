const core = require('@actions/core');
const {promises:fs, statSync} = require("fs");
const path = require('path');
const isImage = require('is-image');

const MAX_SIZE = 4000000;
const MAX_NUM_IMG = 1;
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
  return files;
}

getFiles(process.argv[2]).then(() => {
  if(!valid) {
      if (typeErrors.length > 0) {
        console.warn(`Images should be of format ${[...ALLOWED_IMG_EXT]}:`)
        typeErrors.map((file) => console.warn(file))
      }
      if (sizeErrors.length > 0) {
        console.warn(`Images should be below ${MAX_SIZE/1000000}MB:`)
        sizeErrors.map((file) => console.warn(file))
      }
      if (tooManyImages.length > 0) {
        console.warn(`Components should contain less than 6 images:`)
        tooManyImages.map((dir) => console.warn(dir))
      }
      core.setFailed('Check image requirements!')
  }
})

