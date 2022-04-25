const fs = require('fs');
const path = require('path');
// Removes the first two arguments passed by `node`, these aren't needed for this function to run - CM
const pathsToSanitize = process.argv.slice(2);

if (pathsToSanitize.length < 1)
  console.log(
    "You must pass a file path as an argument for the sanitize function to run \nExample: 'yarn sanitize-dashboard node-js/express'"
  );

const sanitizeDashboard = (fileContent) => {
  return fileContent
    .replace(/\"accountId\"\s*:\s*\d+/g, '"accountId": 0') // Anonymize account ID
    .replace(/\"linkedEntityGuids\"\s*:\s*\[([\t\n\r]*)?.*([\t\n\r]*)?\s*\]/g, '"linkedEntityGuids": null') // Set linkedEntityGuids to null
    .replace(/^.+\"permissions\".+\n?/gm, '') // Remove permissions
    .replace(/[\}\]]\,(?!\s*?[\{\[\"\'\w])/g, '}'); // Remove trailing commas if any left after json blocks
};

const checkDirForDashboardJson = (directory) => {
    const files = fs.readdirSync(directory, {withFileTypes: true});
    return {
      directories: files.filter((file) => file.isDirectory()).map(file => path.resolve(directory, file.name)),
      jsonFiles: files.filter((file) => file.name.includes('json')).map(file => path.resolve(directory, file.name))
    };
};

pathsToSanitize.forEach((i) => {
  const directory = path.resolve('..', 'quickstarts', `${i}`, 'dashboards');
  const files = checkDirForDashboardJson(directory);
  let jsonFiles = files.jsonFiles;

  for (let nestedDir of files.directories) {
    let nestedFiles = checkDirForDashboardJson(nestedDir);
    if(nestedFiles.jsonFiles.length > 0) {
      jsonFiles = jsonFiles.concat(nestedFiles.jsonFiles);
    }
  }

  if (jsonFiles.length < 1) {
    console.log(
      'No .json files exist within this directory, skipping sanitization...'
    );
    return;
  }

  for (let filePath of jsonFiles) {
    const quickStart = fs.readFileSync(filePath, { encoding: 'utf8' });
    const cleanFile = sanitizeDashboard(quickStart);

    if (cleanFile !== quickStart) {
      fs.writeFile(filePath, cleanFile, { encoding: 'utf8' }, function (err) {
        if (err) {
          console.error(`Error updating ${filePath}`);
          process.exit(1);
        } else {
          console.log(`=> Sanitized ${filePath}`);
        }
      });
    }
  }
});
