import * as glob from 'glob';
import * as path from 'path';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import type { DataSourceConfig } from '../types/DataSourceConfig';

import DataSource, { getAllDataSourceFiles } from '../lib/DataSource';

const ARTIFACT_SCHEMA_PATH = './artifact.json';
const CORE_DATASOURCE_IDS_PATH = './core-datasource-ids.json';
const DATASOURCE_BASE_PATH = '../../';

// TODO: infer the type from the schema?
type ArtifactSchema = {
  properties: {
    datasourceIds: {
      enum: string[];
    };
  };
};

const getCommunityDatasourceIds = (): string[] => {
  const allDataSources = getAllDataSourceFiles(DATASOURCE_BASE_PATH).map(
    (p) => ({
      filePath: p,
      content: yaml.load(
        fs.readFileSync(p).toString('utf-8')
      ) as DataSourceConfig,
    })
  );

  return allDataSources
    .map((datasource) => datasource.content?.id)
    .filter(Boolean);
};

const getCoreDatasourceIds = (): string[] => {
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
    properties: {
      ...schema.properties,
      datasourceIds: { enum: ids },
    },
  };
};

const saveSchema = (schema: ArtifactSchema, path: string): void => {
  fs.writeFileSync(path, JSON.stringify(schema, null, 2));
};

const main = (): void => {
  const communityIds = getCommunityDatasourceIds();
  console.log(`[*] Found ${communityIds.length} community datasources`);

  const coreIds = getCoreDatasourceIds();
  console.log(`[*] Found ${coreIds.length} core datasources`);

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
