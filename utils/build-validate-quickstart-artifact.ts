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
import { passedProcessArguments } from './lib/helpers';

type ArtifactSchema = Record<string, unknown>;

type InvalidItem = {
  value: unknown;
  component: unknown;
  error: ErrorObject;
}

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
export const getArtifactComponents = (): ArtifactComponents => {
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

export const getDataSourceIds = (filepath: string, communityDataSources: DataSourceConfig[]): string[] => {
  const coreDataSourceIds = yaml.load(
    fs.readFileSync(filepath).toString('utf8')
  ) as string[];

  const communityDataSourceIds = communityDataSources.map((dataSource) => dataSource.id);

  return [...coreDataSourceIds, ...communityDataSourceIds];
}

export const validateArtifact = (schema: ArtifactSchema, artifact: Artifact): ErrorObject[] => {
  const ajv = new Ajv({ allErrors: true });
  ajv.validate(schema, artifact);

  return ajv.errors ?? [];
}

const main = (shouldOutputArtifact: boolean = false) => {
  const schema = getSchema('./schema/artifact.json');
  const components = getArtifactComponents();
  const dataSourceIds = getDataSourceIds('./schema/core-datasource-ids.json', components.dataSources);
  const artifact = { ...components, dataSourceIds };
  const errors = validateArtifact(schema, artifact);

  if (errors.length) {
    const invalidItems = getInvalidItems(errors, artifact);
    printErrors(invalidItems);
    process.exit(1);
  }

  console.log('[*] Validation succeeded');

  if (shouldOutputArtifact) {
    outputArtifact(artifact);
  }
}

const outputArtifact = (artifact: Artifact) => {
  console.log('[*] Outputting the artifact');
  try {
    fs.mkdirSync('./build', { recursive: true });

    // Dump the artifact to artifact.json
    fs.writeFileSync('./build/artifact.json', JSON.stringify(artifact));
    // Copy the schema to schema.json
    fs.copyFileSync('./schema/artifact.json', './build/schema.json');
  } catch (e) {
    console.error('Error writing artifact to file:', e);
    process.exit(1);
  }
}

const getInvalidItems = (errors: ErrorObject[], artifact: ArtifactSchema): InvalidItem[] => {
  return errors.map((error) => {
    // Get the path to the invalid value from the error `instancePath`.
    // NOTE: we're using `slice(1)` here to remove the leading `/` in the path.
    const invalidValuePath = error.instancePath.split('/').slice(1);

    const value = get(artifact, invalidValuePath);

    // Get the specific "component" (e.g. the alert or dashboard) that contains
    // the invalid value. This makes the assumption that the first two parts of
    // the "path" are the component type and the index in the array.
    const component = get(artifact, invalidValuePath.slice(0, 2));

    return { value, component, error };
  });
}

const printErrors = (invalidItems: InvalidItem[]): void => {
  console.error('*** Validation failed. See errors below. ***');
  console.error('--------------------------------------------');

  invalidItems.forEach(({ value, component, error }, idx) => {
    console.error(`Error #${idx + 1}:`, error);
    console.error('');
    console.error('Received value:', value);

    console.error('');
    if (component !== value) {
      console.error('Invalid component:', component);
    }

    if (idx < invalidItems.length - 1) {
      console.error('************************************');
    }
  });
}

if (require.main === module) {
  const shouldOutputArtifact = passedProcessArguments().includes('--output-artifact');
  main(shouldOutputArtifact);
}
