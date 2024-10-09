import * as path from 'path';
import Quickstart from '../lib/Quickstart';
import DataSource from '../lib/DataSource';
import Alert from '../lib/Alert';
import Dashboard from '../lib/Dashboard';
import {
  getArtifactComponents,
  validateArtifact,
} from '../build-validate-quickstart-artifact';

const MOCK_FILES_BASEPATH = path.resolve(__dirname, '..', 'mock_files');

const mockQuickstart1 = new Quickstart(
  '/quickstarts/mock-quickstart-1/config.yml',
  MOCK_FILES_BASEPATH
);

const mockQuickstart2 = new Quickstart(
  'quickstarts/mock-quickstart-2/config.yml',
  MOCK_FILES_BASEPATH
);

const mockDataSource1 = new DataSource(
  'test-data-source',
  MOCK_FILES_BASEPATH
)

const mockAlert1 = new Alert(
  'mock-alert-policy-1',
  MOCK_FILES_BASEPATH
);

const mockDashboard1 = new Dashboard('mock-dashboard-1', MOCK_FILES_BASEPATH);

describe('built-validate-quickstart-artifact', () => {
  beforeEach(() => {
    // disable normal logging used as feedback while script runs
    jest.spyOn(console, 'log').mockImplementation(() => {});
  });

  describe('build', () => {
    it('should find all of the components', () => {
      Quickstart.getAll = jest
        .fn()
        .mockReturnValueOnce([mockQuickstart1, mockQuickstart2]);

      DataSource.getAll = jest.fn().mockReturnValueOnce([mockDataSource1]);

      Alert.getAll = jest.fn().mockReturnValueOnce([mockAlert1]);
      Dashboard.getAll = jest.fn().mockReturnValueOnce([mockDashboard1]);

      const actual = getArtifactComponents();

      expect(actual.quickstarts).toHaveLength(2);
      expect(actual.quickstarts[0].dashboards).toEqual([]);
      expect(actual.quickstarts[1].dashboards).toEqual(['mock-dashboard-1']);

      expect(actual.dataSources).toHaveLength(1);
      expect(actual.dataSources[0].id).toEqual('test-data-source');

      expect(Object.keys(actual.alerts)).toHaveLength(1);
      expect(Object.keys(actual.alerts)).toContain('mock-alert-policy-1');

      expect(Object.keys(actual.dashboards)).toHaveLength(1);
      expect(Object.keys(actual.dashboards)).toContain('mock-dashboard-1');
    });
  });

  describe('validate', () => {
    const TEST_SCHEMA = {
      type: 'object',
      properties: {
        quickstarts: { type: 'array' },
        alerts: { type: 'object' },
        dashboards: { type: 'object' },
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
          mockDataSource1
        ]);

      const components = getArtifactComponents();

      const artifact = { ...components, dataSourceIds: ['core-1', 'core-2'] };

      const actual = validateArtifact(TEST_SCHEMA, artifact);

      expect(actual).toHaveLength(0);
    });

    it('should correctly return errors for an invalid artifact', () => {
      Quickstart.getAll = jest.fn().mockReturnValueOnce([]);
      Alert.getAll = jest.fn().mockReturnValueOnce([]);
      Dashboard.getAll = jest.fn().mockReturnValueOnce([]);
      DataSource.getAll = jest.fn().mockReturnValueOnce([]);

      const components = getArtifactComponents();

      const artifact = {
        ...components,
        dataSources: [
          { id: 'community-1', title: 'DataSource 1' },
          { id: false, title: 'DataSource 2' },
          { id: 'community-3', title: 3 },
        ],
        dataSourceIds: ['core-1', 'core-2'],
      };

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
