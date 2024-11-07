import * as fs from 'fs';
import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';

import { QuickstartConfig } from './types/QuickstartConfig';

const getQuickstartPaths = () =>
  glob.sync(path.resolve('..', 'quickstarts', '**', 'config.+(yml|yaml)'));

const findMissingIds = (quickstartPaths: string[]) => {
  const quickstartsMissingIds: string[] = [];

  quickstartPaths.forEach((filePath) => {
    const config = yaml.load(
      fs.readFileSync(filePath).toString('utf-8')
    ) as QuickstartConfig;

    if (!config.id) {
      quickstartsMissingIds.push(config.title);
    }
  });

  return quickstartsMissingIds;
};

const main = () => {
  const quickstartPaths = getQuickstartPaths();
  const quickstartsMissingIds = findMissingIds(quickstartPaths);

  if (quickstartsMissingIds.length > 0) {
    console.log('\nThe following quickstarts are missing IDs:');
    quickstartsMissingIds.forEach((title) => console.log(`\t- ${title}`));

    process.exit(1);
  }

  console.log('[*] All quickstarts have IDs');
};

if (require.main === module) {
  main();
}
