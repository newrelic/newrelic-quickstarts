const {
  readQuickstartFile,
  findMainQuickstartConfigFiles,
} = require('./helpers');

/**
 * Validate that a quickstart has a logo image
 * @param {String[]} quickstartDirs - The directories of the quickstarts
 * @returns {String[]} - The directories of the quickstarts that do not have a logo image
 */
const validateLogoExists = (quickstartDirs) => {
  const noLogos = quickstartDirs
    .map((quickstart) => {
      const quickstartConfig = readQuickstartFile(quickstart).contents[0];
      
      if (!quickstartConfig.logo) {
        return quickstart.match(/newrelic-quickstarts(.*)/)[1];
      }
      
      
    }).filter(Boolean);
  return noLogos;
};


const main = () => {
  const quickstartDirs = findMainQuickstartConfigFiles();
  const quickstartsWithNoLogos = validateLogoExists(quickstartDirs)
  if (quickstartsWithNoLogos.length > 0) {
    console.log('<!> Found Quickstarts that do not contain logos');
    console.log(quickstartsWithNoLogos);
  } else {
    console.log('(✔) All Quickstarts have logos');
  }

  process.exit(0);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node validate_quickstarts.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}