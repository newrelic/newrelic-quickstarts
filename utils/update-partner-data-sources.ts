import * as path from 'path';
import * as glob from 'glob';
import * as yaml from 'js-yaml';
import * as fs from 'fs';

import Quickstart from './lib/Quickstart';
import InstallPlan from './lib/InstallPlan';

import type {
  DataSourceConfig,
  DataSourceConfigNerdletDirective,
} from './types/DataSourceConfig';

// NOTE: why do we not have a way to look up a quickstart by ID (not identifier?)
const ALL_QUICKSTARTS = Quickstart.getAll();

const getAllConfigFilepaths = () =>
  glob.sync(path.join(__dirname, '../data-sources/**', 'config.+(yml|yaml)'));

const getConfigFromFilepath = (filepath: string) =>
  yaml.load(fs.readFileSync(filepath, 'utf8')) as DataSourceConfig;

const getQuickstartFromConfigFilepath = (filepath: string) => {
  const primary = getConfigFromFilepath(filepath).install
    .primary as DataSourceConfigNerdletDirective;

  return primary.nerdlet?.nerdletId ===
    'nr1-install-newrelic.quickstart-installation-plan'
    ? primary.nerdlet.nerdletState.quickstartId
    : undefined;
};

const getQuickstartInstallPlan = (id?: string) => {
  if (!id) return undefined;

  const quickstart = ALL_QUICKSTARTS.find((qs) => qs.config.id === id);

  // NOTE: feels like we're making some unsafe asumptions here...
  return quickstart?.config.installPlans?.[0] ?? undefined;
};

const getPrimaryInstall = (identifier?: string) => {
  if (!identifier) return undefined;

  const installPlan = new InstallPlan(identifier);

  return installPlan.config.install;
};

const main = () => {
  const dataSourceConfigs = getAllConfigFilepaths();

  const primaryInstalls = dataSourceConfigs
    .map(getQuickstartFromConfigFilepath)
    .map(getQuickstartInstallPlan)
    .map(getPrimaryInstall);

  dataSourceConfigs.forEach((config, i) => {
    console.log(i, config);
    console.log(JSON.stringify(primaryInstalls[i], null, 2));
    console.log('---');
  });
};

main();
