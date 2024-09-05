import * as fs from 'fs';
import * as yaml from 'js-yaml';

import Quickstart from "./lib/Quickstart";
import DataSource from "./lib/DataSource";
import Alert from "./lib/Alert";
import Dashboard, { DashboardConfig } from "./lib/Dashboard";
import Ajv, { type ErrorObject } from 'ajv';
import { QuickstartConfig, QuickstartConfigAlert } from './types/QuickstartConfig';
import { DataSourceConfig } from './types/DataSourceConfig';

type ArtifactSchema = any; // NOTE: we might want to generate this, we might not care

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

  // NOTE: we do an extra `.filter(Boolean)` here because, for some reason, the
  // array of dataources contains a few `undefined`s.
  const communityDataSourceIds = communityDataSources.filter(Boolean).map((dataSource) => dataSource.id);

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
}

// TODO: refactor?
const parseErrors = (errors: ErrorObject[], artifact: Record<string, any>) => {
  return errors.forEach((e, idx) => {
    const artifactItemPath = e.instancePath.split('/').filter(Boolean).map(segment => {
      if (parseInt(segment, 10)) {
        return parseInt(segment);
      }
      return segment;
    });

    const badValue = artifactItemPath.reduce((acc, segment) => {
      // @ts-ignore 
      return acc[segment];
    }, artifact);

    const invalidItem = artifact[artifactItemPath[0]][artifactItemPath[1]];

    console.error(`Error #${idx + 1}:`, e);
    console.error('                         ');
    console.error('Received value:', badValue);
    console.error('                         ');
    // All of our properties in the artifact are arrays so we can make some
    // assumptions to grab the invalid item from the artifact
    if (invalidItem !== badValue) {
      console.error('Invalid item:', invalidItem);
    }

    if (idx + 1 !== errors.length) {
      console.error('************************************');
    }
  });
}

if (require.main === module) {
  main();
}
