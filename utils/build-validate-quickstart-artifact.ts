import Quickstart from "./lib/Quickstart";
import DataSource from "./lib/DataSource";
import Alert from "./lib/Alert";
import Dashboard from "./lib/Dashboard";
import Ajv, { type ErrorObject } from 'ajv';

const main = () => {
  const schema = require('./schema/artifact.json');

  // 1. Fetch all quickstarts, datasources, alerts, and dashboards
  const quickstarts = Quickstart.getAll().map((quickstart) => quickstart.config);
  const dataSources = DataSource.getAll().map((dataSource) => dataSource?.config);
  const alerts = Alert.getAll().map((alert) => alert.config);
  const dashboards = Dashboard.getAll().map((dashboard) => dashboard.config);

  const coreDataSourceIds = require('./schema/core-datasource-ids.json');
  const communityDataSourceIds = dataSources.map((ds) => { return ds?.id });

  // TODO: consider json-schema-to-ts package to infer type from JSON schema
  //  2. Create the artifact
  const artifact = {
    quickstarts,
    dataSources,
    alerts,
    dashboards,
    dataSourceIds: [...coreDataSourceIds, ...communityDataSourceIds]
  };

  // 3. Validate the artifact
  const ajv = new Ajv();
  ajv.validate(schema, artifact);

  if (ajv.errors?.length) {
    console.error('*** Validation failed. See errors below. ***');
    console.error('--------------------------------------------');
    parseErrors(ajv.errors, artifact);

    process.exit(1);
  }
}

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
