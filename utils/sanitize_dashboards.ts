import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';

const sanitizeRawContent = (rawConfig: string): string => {
  return rawConfig
    .replace(/\"accountId\"\s*:\s*\d+/g, '"accountId": 0') // Anonymize account ID
    .replace(
      /\"linkedEntityGuids\"\s*:\s*\[([\t\n\r]*)?.*([\t\n\r]*)?\s*\]/g,
      '"linkedEntityGuids": null'
    ) // Set linkedEntityGuids to null
    .replace(/^.+\"permissions\".+\n?/gm, '') // Remove permissions
    .replace(/[\}\]]\,(?!\s*?[\{\[\"\'\w])/g, '}'); // Remove trailing commas if any left after json blocks
};


const sanitizeDashboards = (pathsToSanitize: string[]) => {
  pathsToSanitize.forEach((dashboardId) => {
    const globPaths: string[] = glob.sync(
      path.resolve('..', 'dashboards', dashboardId, '*.json')
    );

    if (globPaths.length !== 1) {
      console.log(
        'No dashboard or .json files exist within this directory, skipping sanitization...'
      );
      return;
    }

    const filePath: string = globPaths.pop()!;
    const dashboardRawContent: string = fs.readFileSync(filePath, {encoding: 'utf8' });
    const sanitizedRawContent: string = sanitizeRawContent(dashboardRawContent);

    if (dashboardRawContent !== sanitizedRawContent) {
      fs.writeFile(filePath, sanitizedRawContent, { encoding: 'utf8' }, function (err) {
        if (err) {
          console.error(`Error updating ${filePath}`);
          process.exit(1);
        } else {
          console.log(`=> Sanitized ${filePath}`);
        }
      });
    }
  });

}

const main = () => {
  const pathsToSanitize = process.argv.slice(2);

  if (pathsToSanitize.length < 1)
    console.log(
      'You must pass a file path as an argument for the sanitize function to run.:',
      "Example: 'yarn sanitize-dashboard node-js/express'"
    );

  sanitizeDashboards(pathsToSanitize);
}

if (require.main === module) {
  main();
}
