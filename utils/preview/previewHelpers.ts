// Modules
import * as path from 'path';
import * as glob from 'glob';

/**
 * Async function to validate given path is to a single quickstart
 * @param {string} parentDirectory - Quickstart home directory 
 * @param {string} quickstartDirectory - Quickstart directory
*/
export const validatePath = async (parentDirectory: string, quickstartDirectory: string) => {
    const configFile = glob.sync(path.join(parentDirectory, `/quickstarts/${quickstartDirectory}/config.+(yml|yaml)`));
    const fullPath = path.join(parentDirectory, `/quickstarts/${quickstartDirectory}`);
    
    if (!configFile || configFile.length !== 1) {
      console.error(`Could not find a config.yml or config.yaml at ${fullPath}.`);
      process.exit(1);
    }
  };

/**
 * Function to remove paths prior to and including /quickstarts
 * @param {string[]} paths - Array of paths to remove prefixes
*/
export const removePathPrefixes = (paths: string[]) => {
    return paths.map(filePath => filePath.slice(filePath.indexOf('/quickstarts')).slice(1));
};