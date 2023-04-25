import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import InstallPlan from './lib/InstallPlan';
import Quickstart from './lib/Quickstart';
import { passedProcessArguments } from './lib/helpers';

import type {
  DataSourceConfig,
  DataSourceConfigInstallDirective,
} from './types/DataSourceConfig';
import type { InstallPlanInstall } from './types/InstallPlanConfig';

// Get all the quickstarts for icon lookup
const ALL_QUICKSTARTS = Quickstart.getAll();

/**
 * Maps the configuration for an install plan directive to the format needed
 * for a data source primary / fallback installation.
 *
 * In the event that we come accross a targeted install, we return `undefined`
 * since this is not something we can handle with data source installs.
 */
const ipInstallToDsInstall = ({
  mode,
  destination,
}: InstallPlanInstall): DataSourceConfigInstallDirective | undefined => {
  switch (mode) {
    case 'link':
      return {
        link: {
          url: destination.url,
        },
      };
    case 'nerdlet':
      return {
        nerdlet: {
          nerdletId: destination.nerdletId,
          // NOTE: install plans have this type as `{ [x:string]: ngql }` and
          // data sources have this type as `Record<string, string>`. These are
          // functionally the same thing, but we need to cast this with `as` to
          // ensure typescript is happy.
          nerdletState: destination.nerdletState as Record<string, string>,
          // NOTE: install plans do _not_ have any concept of `requiresAccount`
          // so we are defaulting this to `false`.
          requiresAccount: false,
        },
      };
    default:
      // NOTE: Data sources can only be link or nerdlet installs, but install
      // plans can have a `targetedInstall` mode as well. In the event that we
      // come accross this type of install, we are going to ignore it.
      return undefined;
  }
};

/**
 * Given the title for an _install plan_ this will attempt to find a matching
 * _quickstart_ and return it's icon. May return `undefined` if no matching
 * quickstart is found.
 */
const getIconFromQuickstart = (title: string): string | undefined => {
  const quickstart = ALL_QUICKSTARTS.find(
    (qs) => qs.config.title.toLowerCase() === title.toLowerCase()
  );

  let icon = quickstart?.config.icon;

  if (quickstart) {
    /*
      identifier is returning /config.yml so currently this is 
      replacing the last part of the path with /${quickstart.config.icon}
      Might be a better way to do this
    */
    icon = path.join(
      quickstart.basePath,
      quickstart?.identifier.replace(/\/[^\/]*$/, `/${quickstart.config.icon}`)
    );
  }

  return icon;
};

const createDataSourceConfig = ({ config }: InstallPlan): DataSourceConfig => {
  const THIRD_PARTY_PREFIX = 'third-party-';
  const configId = config.id.includes(THIRD_PARTY_PREFIX)
    ? config.id.split('third-party-')[1]
    : config.id;

  const dsConfig: DataSourceConfig = {
    id: configId,
    displayName: config.title,
    description: config.description,
    install: {
      // NOTE: the primary installation for a data source is required, but our
      // conversion function can possibly return `undefined`. We're adding a `!`
      // here because we can reasonbly assume we will _always_ have a non-targed
      // primary install. This assumption might be incorrect in a couple of
      // instances, so we should verify that all created data sources have a
      // primary install.
      primary: ipInstallToDsInstall(config.install)!,
    },
  };

  // Attempt to find an icon for the data source by trying to find quickstarts
  // with the same name as the install plan.
  const icon = getIconFromQuickstart(config.title);
  if (icon) {
    dsConfig.icon = icon;
  }

  // NOTE: it's possible for an install plan to _not_ have a fallback.
  if (config.fallback) {
    dsConfig.install.fallback = ipInstallToDsInstall(config.fallback);
  }

  return dsConfig;
};

/*
 * The sheet we've been preparing for the scripts has a row with data source id, and
 * if its needing to be created it has TO_BE_CREATED.  We are using a csv of the sheet
 * and just filtering the rows by TO_BE_CREATED and mapping to just the install plan id
 */
const getToBeCreatedIdsFromCsv = (csvPath: string): string[] => {
  const fullCSVPath = path.resolve(__dirname, csvPath);
  const csvString = fs.readFileSync(fullCSVPath, { encoding: 'utf-8' });

  const csvRows = csvString.split('\r\n');

  return csvRows
    .filter((row) => row.includes('TO_BE_CREATED'))
    .map((newDS) => newDS.split(',')[0]);
};

/**
 * Helper script that will take an input in the form of a list of install plan
 * IDs and will create files for new _data sources_ based on those install
 * plans.
 */
const main = () => {
  /**
   * Script expects a relative path to the csv containing install
   * plan ids and associated data source ids that need to be created
   */
  const [csvRelativePath] = passedProcessArguments();

  const ids = getToBeCreatedIdsFromCsv(csvRelativePath);
  const plans = ids.map((id) => new InstallPlan(id));
  // filter out the install plans that use a targetedInstall as the primary
  // install directive.
  const { validPlans, targetedPlans } = plans.reduce<{
    validPlans: InstallPlan[];
    targetedPlans: InstallPlan[];
  }>(
    (acc, plan) => {
      return plan.config.install.mode === 'targetedInstall'
        ? { ...acc, targetedPlans: [...acc.targetedPlans, plan] }
        : { ...acc, validPlans: [...acc.validPlans, plan] };
    },
    { validPlans: [], targetedPlans: [] }
  );

  const configs = validPlans.map(createDataSourceConfig);

  for (const config of configs) {
    // create a new directory in the data-sources directory
    const dirpath = path.resolve(__dirname, '../data-sources/', config.id);
    fs.mkdirSync(dirpath);

    if (config.icon) {
      const quickstartIconPath = config.icon;
      config.icon = quickstartIconPath.split('/').pop();

      fs.copyFile(
        quickstartIconPath,
        path.join(dirpath, `/${config.icon}`),
        (err) => {
          if (err) {
            console.error('Could not copy icon: ', err);
          }
        }
      );
    }

    // create a new config file
    const filePath = path.resolve(dirpath, 'config.yml');
    const yamlOptions = {
      lineWidth: -1,
    };

    const fileContent = yaml.dump(config, yamlOptions);
    fs.writeFileSync(filePath, fileContent, { encoding: 'utf8' });
  }

  // for debugging purposes
  console.log(
    'The following install plans have TARGETED install directives and a data source has not been created for them:'
  );
  for (const plan of targetedPlans) {
    console.log(`\t${plan.config.id}`);
  }
};

if (require.main === module) {
  main();
}

export default main;
