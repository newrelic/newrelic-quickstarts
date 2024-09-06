import * as fs from 'fs';
import * as yaml from 'js-yaml';
import get from 'lodash/get';

import Quickstart from "./lib/Quickstart";
import DataSource from "./lib/DataSource";
import Alert from "./lib/Alert";
import Dashboard, { DashboardConfig } from "./lib/Dashboard";
import Ajv, { type ErrorObject } from 'ajv';
import { QuickstartConfig, QuickstartConfigAlert } from './types/QuickstartConfig';
import { DataSourceConfig } from './types/DataSourceConfig';

type ArtifactSchema = any;

type ArtifactComponents = {
  quickstarts: QuickstartConfig[],
  dataSources: DataSourceConfig[],
  alerts: QuickstartConfigAlert[][],
  dashboards: DashboardConfig[]
}

type Artifact = ArtifactComponents | {
  dataSourceIds: string[]
}

const getSchema = (filepath: string): ArtifactSchema => {
  return yaml.load(
    fs.readFileSync(filepath).toString('utf8')
  ) as ArtifactSchema;
};

// NOTE: we could run these in parallel to speed up the script
const getArtifactComponents = (): ArtifactComponents => {
  const quickstarts = Quickstart.getAll().map((quickstart) => quickstart.config);
  console.log(`[*] Found ${quickstarts.length} quickstarts`);

  const dataSources = DataSource.getAll().map((dataSource) => dataSource.config);
  console.log(`[*] Found ${dataSources.length} dataSources`);

  const alerts = Alert.getAll().map((alert) => alert.config);
  console.log(`[*] Found ${alerts.length} alerts`);

  const dashboards = Dashboard.getAll().map((dashboard) => dashboard.config);
  console.log(`[*] Found ${dashboards.length} dashboards`);

  return {
    quickstarts,
    dataSources,
    alerts,
    dashboards
  }
};

const getDataSourceIds = (filepath: string, communityDataSources: DataSourceConfig[]): string[] => {
  const coreDataSourceIds = yaml.load(
    fs.readFileSync(filepath).toString('utf8')
  ) as string[];

  const communityDataSourceIds = communityDataSources.map((dataSource) => dataSource.id);

  return [...coreDataSourceIds, ...communityDataSourceIds];
}

const validateArtifact = (schema: ArtifactSchema, artifact: Artifact): ErrorObject[] => {
  const ajv = new Ajv({ allErrors: true });
  ajv.validate(schema, artifact);

  return ajv.errors ?? [];
}

const main = () => {
  const schema = getSchema('./schema/artifact.json');
  const components = getArtifactComponents();
  const dataSourceIds = getDataSourceIds('./schema/core-datasource-ids.json', components.dataSources);
  const artifact = { ...components, dataSourceIds };
  const errors = validateArtifact(schema, artifact);

  if (errors.length) {
    console.error('*** Validation failed. See errors below. ***');
    console.error('--------------------------------------------');

    parseErrors(errors, artifact);

    process.exit(1);
  }

  console.log('[*] Validation succeeded');
}

const parseErrors = (errors: ErrorObject[], artifact: Record<string, any>) => {
  return errors.forEach((e, idx) => {
    // Get the path to the invalid value from the error `instancePath`.
    // NOTE: we're using `slice(1)` here to remove the leading `/` in the path.
    const invalidValuePath = e.instancePath.split('/').slice(1);

    const invalidValue = get(artifact, invalidValuePath);

    // Get the specific "component" (e.g. the alert or dashboard) that contains
    // the invalid value. This makes the assumption that the first two parts of
    // the "path" are the component type and the index in the array.
    const invalidComponent = get(artifact, invalidValuePath.slice(0, 2));

    console.error(`Error #${idx + 1}:`, e);
    console.error('                         ');
    console.error('Received value:', invalidValue);

    console.error('                         ');
    if (invalidComponent !== invalidValue) {
      console.error('Invalid component:', invalidComponent);
    }

    if (idx + 1 !== errors.length) {
      console.error('************************************');
    }
  });
}

if (require.main === module) {
  main();
}
