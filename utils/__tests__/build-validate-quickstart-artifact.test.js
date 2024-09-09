import * as fs from 'fs';
import Quickstart from '../lib/Quickstart';
import DataSource from '../lib/DataSource';
import Alert from '../lib/Alert';
import Dashboard from '../lib/Dashboard';

import {
  getArtifactComponents,
  getDataSourceIds,
  validateArtifact,
} from '../build-validate-quickstart-artifact';

jest.mock('../lib/Quickstart');
jest.mock('../lib/DataSource');
jest.mock('../lib/Alert');
jest.mock('../lib/Dashboard');
jest.mock('fs');

describe('built-validate-quickstart-artifact', () => {
  beforeEach(() => {
    // disable normal logging used as feedback while script runs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('build', () => {
    it('should find all of the components', () => {
      Quickstart.getAll = jest
        .fn()
        .mockReturnValueOnce([
          { config: 'test-quickstart-1' },
          { config: 'test-quickstart-2' },
        ]);

      DataSource.getAll = jest
        .fn()
        .mockReturnValueOnce([{ config: 'test-dataSource-1' }]);

      Alert.getAll = jest
        .fn()
        .mockReturnValueOnce([{ config: 'test-alert-1' }]);
      Dashboard.getAll = jest
        .fn()
        .mockReturnValueOnce([{ config: 'test-dashboard-1' }]);

      const actual = getArtifactComponents();

      expect(actual.quickstarts).toHaveLength(2);
      expect(actual.quickstarts[0]).toEqual('test-quickstart-1');
      expect(actual.quickstarts[1]).toEqual('test-quickstart-2');
      expect(actual.dataSources).toHaveLength(1);
      expect(actual.dataSources[0]).toEqual('test-dataSource-1');
      expect(actual.alerts).toHaveLength(1);
      expect(actual.alerts[0]).toEqual('test-alert-1');
      expect(actual.dashboards).toHaveLength(1);
      expect(actual.dashboards[0]).toEqual('test-dashboard-1');
    });

    it('should produce a complete list of dataSource IDs', () => {
      Quickstart.getAll = jest.fn().mockReturnValueOnce([]);
      Alert.getAll = jest.fn().mockReturnValueOnce([]);
      Dashboard.getAll = jest.fn().mockReturnValueOnce([]);
      DataSource.getAll = jest
        .fn()
        .mockReturnValueOnce([
          { config: { id: 'community-1' } },
          { config: { id: 'community-2' } },
          { config: { id: 'community-3' } },
        ]);

      const { dataSources } = getArtifactComponents();
      fs.readFileSync.mockReturnValueOnce(JSON.stringify(['core-1', 'core-2']));

      const actual = getDataSourceIds('dummy-file.json', dataSources);

      expect(actual).toHaveLength(5);
      expect(actual).toContain('community-1');
      expect(actual).toContain('community-2');
      expect(actual).toContain('community-3');
      expect(actual).toContain('core-1');
      expect(actual).toContain('core-2');
    });
  });

  describe('validate', () => {
    const TEST_SCHEMA = {
      type: 'object',
      properties: {
        quickstarts: { type: 'array' },
        alerts: { type: 'array' },
        dashboards: { type: 'array' },
        dataSources: {
          type: 'array',
          items: {
            type: 'object',
            properties: {
              id: { type: 'string' },
              title: { type: 'string' },
            },
          },
        },
        getDataSourceIds: { type: 'array', items: { type: 'string' } },
      },
    };

    it('should correctly build and validate valid artifacts with no errors', () => {
      Quickstart.getAll = jest.fn().mockReturnValueOnce([]);
      Alert.getAll = jest.fn().mockReturnValueOnce([]);
      Dashboard.getAll = jest.fn().mockReturnValueOnce([]);
      DataSource.getAll = jest
        .fn()
        .mockReturnValueOnce([
          { config: { id: 'community-1', title: 'DataSource 1' } },
          { config: { id: 'community-2', title: 'DataSource 2' } },
          { config: { id: 'community-3', title: 'DataSource 3' } },
        ]);

      const components = getArtifactComponents();

      fs.readFileSync.mockReturnValueOnce(JSON.stringify(['core-1', 'core-2']));
      const dataSourceIds = getDataSourceIds(
        'dummy-file.json',
        components.dataSources
      );

      const artifact = { ...components, dataSourceIds };

      const actual = validateArtifact(TEST_SCHEMA, artifact);

      expect(actual).toHaveLength(0);
    });

    it('should correctly return errors for an invalid artifact', () => {
      Quickstart.getAll = jest.fn().mockReturnValueOnce([]);
      Alert.getAll = jest.fn().mockReturnValueOnce([]);
      Dashboard.getAll = jest.fn().mockReturnValueOnce([]);
      DataSource.getAll = jest
        .fn()
        .mockReturnValueOnce([
          { config: { id: 'community-1', title: 'DataSource 1' } },
          { config: { id: false, title: 'DataSource 2' } },
          { config: { id: 'community-3', title: 3 } },
        ]);

      const components = getArtifactComponents();

      fs.readFileSync.mockReturnValueOnce(JSON.stringify(['core-1', 'core-2']));
      const dataSourceIds = getDataSourceIds(
        'dummy-file.json',
        components.dataSources
      );

      const artifact = { ...components, dataSourceIds };

      const actual = validateArtifact(TEST_SCHEMA, artifact);

      expect(actual).toHaveLength(2);
      expect(actual).toEqual(
        expect.arrayContaining([
          expect.objectContaining({
            instancePath: '/dataSources/1/id',
          }),
          expect.objectContaining({
            instancePath: '/dataSources/2/title',
          }),
        ])
      );
    });
  });
});
