import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import Quickstart from '../lib/Quickstart';
import { passedProcessArguments } from '../lib/helpers';

const parseCSV = (csvString: string) => {
  const csvRows = csvString.split('\r\n');

  return csvRows.reduce((acc: Record<string, string>, row: string, idx) => {
    if (idx === 0) {
      return acc;
    }

    const rowValues = row.split(',');
    const nextAcc = { ...acc, [rowValues[0]]: rowValues[1] };

    return nextAcc;
  }, {});
};

const NOT_DATASOURCE_IDS = ['TO_BE_CREATED', 'MANUAL'];

const main = async () => {
  const [csvRelativePath] = passedProcessArguments();
  const quickstarts = Quickstart.getAll();

  const fullCSVPath = path.resolve(__dirname, csvRelativePath);

  const csvString = fs.readFileSync(fullCSVPath, { encoding: 'utf-8' });
  const installPlansToDataSources = parseCSV(csvString);

  const installPlanIdsWithoutDataSource: string[] = [];

  quickstarts.forEach((quickstart) => {
    const installPlanIds = quickstart.config.installPlans ?? [];
    const existingDataSourceIds = quickstart.config.dataSourceIds ?? [];

    if (installPlanIds.length === 0) {
      return;
    }

    const newDataSourceIds = installPlanIds.reduce(
      (acc: string[], installPlanId) => {
        const dataSourceId: string =
          installPlansToDataSources[installPlanId] ?? undefined;

        if (dataSourceId === undefined) {
          installPlanIdsWithoutDataSource.push(installPlanId);
          return acc;
        }

        if (NOT_DATASOURCE_IDS.includes(dataSourceId)) {
          return acc;
        }

        return [...acc, dataSourceId];
      },
      []
    );

    const nextDataSourceIds = [
      ...new Set([...existingDataSourceIds, ...newDataSourceIds]),
    ];

    if (nextDataSourceIds.length === 0) {
      return;
    }

    const qsYaml = yaml.load(
      fs.readFileSync(quickstart.configPath, { encoding: 'utf-8' })
    ) as Record<string, any>;

    qsYaml['dataSourceIds'] = nextDataSourceIds;

    // Get positions of top level keys and move dataSourceIds to be adjacent to installPlans fields
    // This gets used in the sortKeys option for the yaml dump
    const yamlKeys = Object.keys(qsYaml);
    yamlKeys.splice(yamlKeys.indexOf('dataSourceIds'), 1);
    yamlKeys.splice(yamlKeys.indexOf('installPlans') + 1, 0, 'dataSourceIds');

    const yamlOptions = {
      lineWidth: -1, // Unlimited
      sortKeys: (a: string, b: string) => {
        const aIdx = yamlKeys.indexOf(a);
        const bIdx = yamlKeys.indexOf(b);

        // Incase we encounter a non-top level key, preserve the order
        if (aIdx === -1 || bIdx === -1) {
          return 0;
        }

        if (aIdx < bIdx) {
          return -1;
        } else if (aIdx > bIdx) {
          return 1;
        } else {
          return 0;
        }
      },
    };

    fs.writeFileSync(
      path.resolve(quickstart.basePath, quickstart.identifier),
      yaml.dump(qsYaml, yamlOptions)
    );
  });

  console.log('Data source assignment to quickstarts complete.');
  console.log(
    `Install plan ids without a datasource: ${installPlanIdsWithoutDataSource.length}`,
    installPlanIdsWithoutDataSource
  );
};

main();
