import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import InstallPlan from './lib/InstallPlan';

import type {
  DataSourceConfig,
  DataSourceConfigInstallDirective,
} from './types/DataSourceConfig';
import type { InstallPlanInstall } from './types/InstallPlanConfig';

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

const createDataSourceConfig = ({ config }: InstallPlan): DataSourceConfig => {
  const dsConfig: DataSourceConfig = {
    id: config.id,
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

  // NOTE: it's possible for an install plan to _not_ have a fallback.
  if (config.fallback) {
    dsConfig.install.fallback = ipInstallToDsInstall(config.fallback);
  }

  return dsConfig;
};

/**
 * Helper script that will take an input in the form of a list of install plan
 * IDs and will create files for new _data sources_ based on those install
 * plans.
 */
const main = () => {
  // TODO: get input (list of InstallPlan Ids) from CSV
  const ids = [
    'third-party-full-story',
    'gatsby-build-newrelic',
    'gcp-infrastructure-monitoring',
    'third-party-github-for-codestream',
    'third-party-gitlab-integration',
    'third-party-gcp-pubsub',
    'cloud-spanner',
    'third-party-grafana-dashboard-migration',
    'third-party-grafana-prometheus-integration',
  ];

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

    // create a new config file
    const filePath = path.resolve(dirpath, 'config.yml');

    // TODO: adjust yaml.DumpOptions to match our YAML styles
    const fileContent = yaml.dump(config);
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
