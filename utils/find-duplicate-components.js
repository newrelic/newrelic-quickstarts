const {
  findQuickstartComponentConfiguration,
  readYamlFile,
  readJsonFile,
} = require('./helpers');

const prop = (k) => (x) => x[k];
const first = (arr) => arr[0];
const unique = (arr) => [...new Set(arr)];
const stringify = (x) => JSON.stringify(x);

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
    .filter((item) => item.name === name)
    .map(prop('contents'))
    .map(stringify);

  return unique(contents).length;
};

const findMultipleVariations = (items) =>
  getNames(items).reduce((acc, name) => {
    const variations = findVariations(name, items);
    return variations > 1 ? { ...acc, [name]: variations } : acc;
  }, {});

const main = () => {
  const dashboards =
    findQuickstartComponentConfiguration('dashboards').map(readJsonFile);
  const problemDashboards = findMultipleVariations(dashboards);

  const alerts =
    findQuickstartComponentConfiguration('alerts').map(readYamlFile);
  const problemAlerts = findMultipleVariations(alerts);

  console.log('Problem dashboards:');
  for (const [name, count] of Object.entries(problemDashboards)) {
    console.log(name, count);
  }

  console.log('\nProblem alerts:');
  for (const [name, count] of Object.entries(problemAlerts)) {
    console.log(name, count);
  }
};

main();
