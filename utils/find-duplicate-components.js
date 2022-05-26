const {
  findQuickstartComponentConfiguration,
  readYamlFile,
  readJsonFile,
  globFiles,
  getQuickstartFromFilename,
} = require('./helpers');
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
  for (const dashboard of dashboardContents) {
    const otherDashboards = new Set(
      dashboardContents
        .filter((d) => d.name.trim() !== dashboard.name.trim())
        .map(prop('pages'))
        .map(stringify)
    );

    const dashPage = JSON.stringify(dashboard.pages);
    if (otherDashboards.has(dashPage)) {
      if (!duplicates[dashPage]) {
        duplicates[dashPage] = [];
      }
      duplicates[dashPage].push(dashboard.name.trim());
    }
  }

  const allDups = new Set(Object.values(duplicates).flatMap((d) => d));
  allDups.add('Bunny');
  allDups.add('Authlogic');
  // console.log(allDups);

  // loop through each dashboard
  //   skip if it is one of the duplicates
  //   get the contents of that dashboard's directory (.json file and screenshots)
  //   create directory under top level dashboards/
  //   loop through those files
  //     copy to the new directoy
  //     delete the old file
  //   delete old dashboard directory
  //   if quickstart's dashboard directory is empty, delete it
  //
  //   Update the quickstart's config to refernce the new dashboard location

  for (const dash of dashboards) {
    const dashContent = dash.contents[0];

    // Skip any non-unique dashboards, we will move them manually
    if (allDups.has(dashContent.name.trim())) {
      continue;
    }

    // dashboards/apache/apache.json
    // dashboards/apache
    const pathToDir = path.dirname(dash.path);

    // add to config.yml
    const newDirName = pathToDir.split('/').pop();

    const filesInDir = globFiles(pathToDir);

    const dashboardTopLevel = path.resolve(__dirname, '../dashboards');

    filesInDir.forEach((filePath) => {
      const fileName = path.basename(filePath);
      const newPath = path.resolve(dashboardTopLevel, newDirName, fileName);
      fs.renameSync(filePath, newPath);

      //console.log(filePath, '\n', newPath, '\n');
    });

    // add reference back to the quickstart config
    const associatedQuickstart = getQuickstartFromFilename(dash.path);

    const globPath = path.join('/', associatedQuickstart, `config.+(yml|yaml)`);

    const configFilePath = glob.sync(globPath)[0];

    const dashboardField = `\ndashboards\n  - ${newDirName}`;
    fs.appendFileSync(configFilePath, dashboardField);
  }
};

main();
