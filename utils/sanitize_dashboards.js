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
    .replace(/[\}\)\]]\,(?!\s*?[\{\[\"\'\w])/g, '}'); // Remove trailing commas if any left after json blocks
};

pathsToSanitize.forEach((i) => {
  const directory = path.resolve('..', 'quickstarts', `${i}`, 'dashboards');
  const files = fs.readdirSync(directory, { withFileTypes: true });
  const jsonFiles = files.filter((file) => file.name.includes('.json'));

  if (jsonFiles.length < 1) {
    console.log(
      'No .json files exist within this directory, skipping sanitization...'
    );
    return;
  }

  for (let file of jsonFiles) {
    const filePath = path.resolve(directory, file.name);
    const quickStart = fs.readFileSync(filePath, { encoding: 'utf8' });
    const cleanFile = sanitizeDashboard(quickStart);

    if (cleanFile !== file) {
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
