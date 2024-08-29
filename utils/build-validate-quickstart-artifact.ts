import Quickstart from "./lib/Quickstart";
import DataSource from "./lib/DataSource";
import Alert from "./lib/Alert";
import Dashboard from "./lib/Dashboard";
import Ajv from 'ajv';

const main = () => {
  const schema = require('./schema/artifact.json');

  // 1. Fetch all quickstarts, datasources, alerts, and dashboards
  const quickstarts = Quickstart.getAll().map((quickstart) => quickstart.config);
  //const datasources = DataSource.getAll().map((datasource) => datasource.config);
  const alerts = Alert.getAll().map((alert) => alert.config);
  const dashboards = Dashboard.getAll().map((dashboard) => dashboard.config);

  const coreDatasourceIds = require('./schema/core-datasource-ids.json');
  //const communityDatasourceIds = datasources.map((ds) => { console.log(ds); return ds.id });

  // TODO: consider json-schema-to-ts package to infer type from JSON schema
  //  2. Create the artifact
  const artifact = {
    quickstarts,
    //datasources,
    alerts,
    dashboards,
    dataSourceIds: [...coreDatasourceIds]
  };

  // 3. Validate the artifact
  const ajv = new Ajv();
  ajv.validate(schema, artifact);

  console.log(ajv.errors, 'ERRORS');
}

if (require.main === module) {
  main();
}
