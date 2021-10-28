const fs = require('fs');
const { readdir } = require('fs').promises;
// Removes the first two arguments passed by `node`, these aren't needed for this function to run - CM
const pathsToSanitize = process.argv.slice(2);

if (pathsToSanitize.length < 1)
  console.log(
    "You must pass a file path as an argument for the sanitize function to run \nExample: 'yarn sanitize-dashboard node-js/express'"
  );

const sanitizeDashboard = (fileContent) => {
  return fileContent
    .replace(/\"accountId\"\s*:\s*\d+\s*/g, '"accountId": 0') // Anonymize account ID
    .replace(/^.+\"linkedEntityGuids\".+\n?/gm, '"linkedEntityGuids": null') // Remove linkedEntityGuids
    .replace(/^.+\"permissions\".+\n?/gm, '') // Remove permissions
    .replace(/[\}\)\]]\,(?!\s*?[\{\[\"\'\w])/g, '}'); // Remove trailing commas if any left after json blocks
};

pathsToSanitize.forEach(async (i) => {
  const directory = `../quickstarts/${i}/dashboards/`;
  const files = await readdir(directory, { withFileTypes: true });
  const jsonFiles = files.filter((file) => file.name.includes('.json'));

  if (jsonFiles.length < 1) {
    console.log(
      'No .json files exist within this directory, skipping sanitization...'
    );
  }

  for (let file of jsonFiles) {
    const filePath = directory + file.name;
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
