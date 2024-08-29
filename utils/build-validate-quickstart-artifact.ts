import fs from 'fs';
import path from 'path';

import Quickstart from "./lib/Quickstart";
import DataSource from "./lib/DataSource";
import Alert from "./lib/Alert";
import Dashboard from "./lib/Dashboard";
import Ajv from 'ajv';

const main = () => {
  // 1. Fetch all quickstarts, datasources, alerts, and dashboards
  const quickstarts = Quickstart.getAll().map((quickstart) => quickstart.config);
  //const datasources = DataSource.getAll().map((datasource) => datasource.config);
  const alerts = Alert.getAll().map((alert) => alert.config);
  const dashboards = Dashboard.getAll().map((dashboard) => dashboard.config);

  //console.log(datasources[0]);
  const coreDatasourceIds = JSON.parse(fs.readFileSync(path.join(__dirname, 'schema', 'core-datasource-ids.json'), 'utf8'));
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
  ajv.validate(require('./schema/artifact.json'), artifact);

  console.log(ajv.errors, 'ERRORS');
}

if (require.main === module) {
  main();
}
