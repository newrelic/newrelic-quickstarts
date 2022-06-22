'use strict';

// To use this comparison file:
// Create two directories with the create-quickstart-snapshots script
// place new snapshots in `snapshots` and old snapshots in `snapshots-old-dir`
// run `yarn run jest compare-snapshots.test.js`

import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';

const readJsonFile = (p) => {
  const file = fs.readFileSync(p);
  return JSON.parse(file);
};

const oldSnapShotGlob = path.resolve(
  __dirname,
  '..',
  '..',
  'snapshots-old-dir',
  '*.json'
);
const newSnapShotGlob = path.resolve(
  __dirname,
  '..',
  '..',
  'snapshots',
  '*.json'
);

const oldSnapShotFiles = glob.sync(oldSnapShotGlob).sort().map(readJsonFile);
const newSnapShotFiles = glob.sync(newSnapShotGlob).sort().map(readJsonFile);

const zippedTogether = oldSnapShotFiles.map((s, index) => [
  s,
  newSnapShotFiles[index],
]);
//.filter((zipped) => zipped[0].slug === 'zebrium');

console.log('Total old: ', oldSnapShotFiles.length);
console.log('Total new: ', newSnapShotFiles.length);

describe('test', () => {
  test.each(zippedTogether)('comparing %s to %s', (old, newish) => {
    delete old.sourceUrl;
    delete newish.sourceUrl;
    old.dashboards?.forEach((d) => {
      delete d.sourceUrl;
      delete d.displayName;
      delete d.screenshots;
    });
    newish.dashboards?.forEach((d) => {
      delete d.sourceUrl;
      delete d.displayName;
      delete d.screenshots;
    });

    old.dashboards?.forEach((d, i) => {
      const oldParsed = JSON.parse(d.rawConfiguration);
      const newParsed = JSON.parse(newish.dashboards[i].rawConfiguration);

      expect(newParsed.pages).toEqual(oldParsed.pages);
    });

    old.dashboards?.forEach((d) => {
      delete d.rawConfiguration;
    });
    newish.dashboards?.forEach((d) => {
      delete d.rawConfiguration;
    });

    old.alertConditions?.forEach((d) => {
      delete d.sourceUrl;
    });
    newish.alertConditions?.forEach((d) => {
      delete d.sourceUrl;
    });

    expect(newish).toEqual(old);
  });
});
