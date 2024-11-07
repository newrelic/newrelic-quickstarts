import * as fs from 'fs';
import * as yaml from 'js-yaml';

import type { DataSourceConfig } from '../types/DataSourceConfig';

import { getAllDataSourceFiles } from '../lib/DataSource';

const ARTIFACT_SCHEMA_PATH = './artifact.json';
const CORE_DATASOURCE_IDS_PATH = './core-datasource-ids.json';
const DATASOURCE_BASE_PATH = '../../';

type ArtifactSchema = {
  definitions: {
    dataSourceIds: {
      enum: string[];
    };
  };
};

const getCommunityDataSourceIds = (): string[] => {
  const allDataSources = getAllDataSourceFiles(DATASOURCE_BASE_PATH).map(
    (p) => ({
      filePath: p,
      content: yaml.load(
        fs.readFileSync(p).toString('utf-8')
      ) as DataSourceConfig,
    })
  );

  return allDataSources
    .map((dataSource) => dataSource.content?.id)
    .filter(Boolean);
};

const getCoreDataSourceIds = (): string[] => {
  return yaml.load(
    fs.readFileSync(CORE_DATASOURCE_IDS_PATH).toString('utf8')
  ) as string[];
};

const loadSchema = (filepath: string): ArtifactSchema => {
  return yaml.load(
    fs.readFileSync(filepath).toString('utf8')
  ) as ArtifactSchema;
};

const updateSchema = (
  schema: ArtifactSchema,
  ids: string[]
): ArtifactSchema => {
  return {
    ...schema,
    definitions: {
      ...schema.definitions,
      dataSourceIds: { enum: ids },
    },
  };
};

const saveSchema = (schema: ArtifactSchema, path: string): void => {
  fs.writeFileSync(path, JSON.stringify(schema, null, 2));
};

const main = (): void => {
  const communityIds = getCommunityDataSourceIds();
  console.log(`[*] Found ${communityIds.length} community dataSources`);

  const coreIds = getCoreDataSourceIds();
  console.log(`[*] Found ${coreIds.length} core dataSources`);

  console.log('[*] Loading schema');
  const schema = loadSchema(ARTIFACT_SCHEMA_PATH);

  console.log('[*] Updating enum');
  const updatedSchema = updateSchema(schema, [...communityIds, ...coreIds]);

  console.log('[*] Saving updated schema');
  saveSchema(updatedSchema, ARTIFACT_SCHEMA_PATH);
};

if (require.main === module) {
  main();
}
