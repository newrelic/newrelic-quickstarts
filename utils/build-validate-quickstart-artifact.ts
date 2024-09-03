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
    parseErrors(ajv.errors, artifact);
  }
}

const parseErrors = (errors: ErrorObject[], artifact: Record<string, any>) => {
  return errors.forEach((e) => {
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

    console.error('*** Validation failed ***');
    console.error('-------------------------');
    console.error(e);
    console.error('-------------------------');
    console.error('Received value:', badValue);
    console.error('-------------------------');
    console.error('Invalid item:', artifact[artifactItemPath[0]][artifactItemPath[1]]);
  });
}

if (require.main === module) {
  main();
}
