import * as fs from 'fs';
import Dashboard from './lib/Dashboard'; 

const sanitizeDashboards = (pathsToSanitize: string[]) => {
  pathsToSanitize.forEach((i) => {
    const dashboard = new Dashboard(i);

    if (!dashboard.isValid) {
      console.log(
        'No dashboard or .json files exist within this directory, skipping sanitization...'
      );
      return;
    }

    const dashboardRawConfig: string = JSON.stringify(dashboard.config)
    const sanitizedRawConfig: string = dashboard.sanitizeConfig();

    if (dashboardRawConfig !== sanitizedRawConfig) {
      fs.writeFile(dashboard.fullPath, sanitizedRawConfig, { encoding: 'utf8' }, function (err) {
        if (err) {
          console.error(`Error updating ${dashboard.fullPath}`);
          process.exit(1);
        } else {
          console.log(`=> Sanitized ${dashboard.fullPath}`);
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
