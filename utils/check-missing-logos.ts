import {
  readQuickstartFile,
  findMainQuickstartConfigFiles,
  FilePathAndContents,
} from './helpers';
import { QuickstartConfig } from './types/QuickstartConfig';

const validateIconExists = (
    quickstartDirs: string[]
  ): string[] => {
  return quickstartDirs.filter((quickstart: string) => {
    const config: QuickstartConfig = <QuickstartConfig>readQuickstartFile(quickstart).contents[0];
    return !config.icon;
  });
};

const main = (): void => {
  const quickstartDirs: string[] = findMainQuickstartConfigFiles();
  const noIcons: string[] = validateIconExists(quickstartDirs);
  if (noIcons.length > 0) {
    console.log('<!> Found Quickstarts that do not contain icons');
    console.log(noIcons);
  } else {
    console.log('(✔) All Quickstarts have Icons');
  }

  process.exit(0);
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'node check-missing-icons.js', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
