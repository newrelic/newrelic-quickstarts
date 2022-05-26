const {
  findQuickstartComponentConfiguration,
  readYamlFile,
  readJsonFile,
  globFiles,
  getQuickstartFromFilename,
} = require('../helpers');
const path = require('path');
const fs = require('fs');
const glob = require('glob');

const prop = (k) => (x) => x[k];
const first = (arr) => arr[0];
const unique = (arr) => [...new Set(arr)];
const stringify = (x) => JSON.stringify(x);
const slugify = (str) =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');
const inspect = (x) => {
  console.log(x);
  return x;
};

const getNames = (components) =>
  components
    .map(prop('contents'))
    .map(first)
    .map(prop('name'))
    .reduce((names, name) => unique([...names, name]), []);

const findVariations = (name, items) => {
  const contents = items
    .map(prop('contents'))
    .map(first)
    .filter((qs) => qs.name !== name)
    .map(prop('pages'))
    .map(stringify);

  return unique(contents).length;
};

const findMultipleVariations = (items) =>
  getNames(items).reduce((acc, name) => {
    const variations = findVariations(name, items);
    return variations > 1 ? { ...acc, [name]: variations } : acc;
  }, {});

// gather a list of all dashboard file paths
// read those dashboards from the filesystem
// for each dashboard
//    compare `pages` field against all other dashboard `pages` fields
//    if dashboard has a duplicate
//       add it to the array of duplicates

const main = () => {
  const dashboards =
    findQuickstartComponentConfiguration('dashboards').map(readJsonFile);
  const dashboardContents = dashboards.map(prop('contents')).map(first);

  const duplicates = {};
  for (const dashboard of dashboards) {
    const content = dashboard.contents[0];
    const otherDashboards = new Set(
      dashboardContents
        .filter((d) => d.name.trim() !== content.name.trim())
        .map(prop('pages'))
        .map(stringify)
    );

    const dashPage = JSON.stringify(content.pages);
    if (otherDashboards.has(dashPage)) {
      if (!duplicates[dashPage]) {
        duplicates[dashPage] = [];
      }
      duplicates[dashPage].push({
        name: content.name.trim(),
        filePath: dashboard.path,
      });
    }
  }

  const allDups = Object.values(duplicates);
  console.log(allDups);

  const dashboardTopLevel = path.resolve(__dirname, '../../dashboards');
  for (const setOfDuplicates of allDups) {
    for (const { name, filePath } of setOfDuplicates) {
      const dashDirPath = path.dirname(filePath);
      const dashDirName = dashDirPath.split('/').pop();
      const dashFiles = globFiles(dashDirPath);

      // Check to see if it's already been moved
      const topLevelPath = path.join(dashboardTopLevel, dashDirName);
      if (!fs.existsSync(topLevelPath)) {
        fs.mkdirSync(topLevelPath);
        // move the files
        dashFiles.forEach((f) => {
          const fileName = path.basename(f);
          const newFilePath = path.join(topLevelPath, fileName);
          fs.copyFileSync(f, newFilePath);
        });
      }

      // delete dashboard files in quickstart dir
      dashFiles.forEach((f) => {
        fs.rmSync(f);
      });

      // write reference back to config
      const associatedQuickstart = getQuickstartFromFilename(filePath);

      const globPath = path.join(
        '/',
        associatedQuickstart,
        `config.+(yml|yaml)`
      );

      const configFilePath = glob.sync(globPath)[0];

      const dashboardField = `\ndashboards:\n  - ${dashDirName}`;
      console.log(`adding reference to quickstart ${configFilePath}`);
      fs.appendFileSync(configFilePath, dashboardField);
    }
  }

  //allDups.add('Bunny');
  //allDups.add('Authlogic');
  return;
};

main();
