const {promises:fs, statSync} = require("fs");
const path = require('path');
const isImage = require('is-image');
const core = require('@actions/core');

const MAX_SIZE = 4000000
const ALLOWED_IMG_EXT = [
  '.png',
  '.jpg',
  '.svg',
]
let valid = true,
    sizeErrors = [],
    typeErrors = [];

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
            sizeErrors.push({filePath, fileSize: fileSize/1000000})
            valid = false
        }
        if (!ALLOWED_IMG_EXT.includes(fileExt)){
            typeErrors.push(filePath)
            valid = false
        }
      })
      // .map(file => ({ ...file, path: path + file.name, size: statSync(path + file.name) }));
  // console.log(files)
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
        console.warn(`Images should be of format ${[...ALLOWED_IMG_EXT]}`)
        typeErrors.map((file) => console.warn(file))
      }
      if (sizeErrors.length > 0) {
        console.warn(`Images should be below ${MAX_SIZE/1000000}MB`)
        sizeErrors.map((file) => console.warn(JSON.stringify(file)))
      }
      core.setFailed('Check image formats and sizes')
  }
})

