import * as glob from 'glob';
import * as path from 'path';
import {
  readQuickstartFile,
  removeRepoPathPrefix,
  getMatchingNames,
  cleanQuickstartName,
} from './helpers';

interface DashboardNamesAndPaths {
  name: string;
  path: string;
}

// TODO: move this to a types file when we convert other scripts to typescript
interface DashboardConfigs {
  path: string;
  contents: {
    name: string;
  }[];
}

/** Returns any quickstart dashboards with matching names and their filepaths */
const findMatchingDashboardNames = (): DashboardNamesAndPaths[] => {
  const dashboardConfigs = glob.sync(
    path.resolve(process.cwd(), '../quickstarts/**/dashboards/*/*.+(json)')
  );
  // TODO: remove 'as' when we update readQuickstartFile to typescript
  const parsedDashboardConfigs = dashboardConfigs.map(
    readQuickstartFile
  ) as DashboardConfigs[];

  const dashboardNamesAndPaths = parsedDashboardConfigs.map((configFile) => ({
    name: cleanQuickstartName(configFile.contents[0].name),
    path: configFile.path,
  }));

  // TODO: remove 'as' when we update getMatchingNames to typescript
  return getMatchingNames(dashboardNamesAndPaths) as DashboardNamesAndPaths[];
};

const main = () => {
  const nameMatches = findMatchingDashboardNames();
  if (nameMatches.length > 0) {
    console.error(`ERROR: Found matching quickstart dashboard names`);
    console.error(`Punctuation and white space are removed before comparison`);
    nameMatches.forEach((m) =>
      console.error(`${m.name} in ${removeRepoPathPrefix(m.path)}`)
    );
    console.error(
      `Please update your quickstart dashboard's name to be unique\n`
    );
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}
