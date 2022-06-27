import * as path from 'path';
import { GITHUB_RAW_BASE_URL, GITHUB_REPO_BASE_URL } from '../../constants';
import Quickstart from '../Quickstart';

const MOCK_FILES_BASEPATH = path.resolve(__dirname, '../../mock_files');

describe('Quickstart', () => {
  afterAll(() => {
    jest.clearAllMocks();
  });

  describe('constructor', () => {
    test('Creates valid quickstart', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-2/config.yml',
        MOCK_FILES_BASEPATH
      );

      expect(qs.isValid).toBe(true);
    });

    test('Creates invalid quickstart', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});

      const qs = new Quickstart('', MOCK_FILES_BASEPATH);

      expect(qs.isValid).toBe(false);
    });
  });

  describe('getConfigContent', () => {
    test('Handles invalid quickstart', () => {
      jest.spyOn(global.console, 'error').mockImplementation(() => {});

      const qs = new Quickstart('', MOCK_FILES_BASEPATH);

      expect(qs.getConfigContent()).toBeUndefined();
    });

    test('Reads in config file', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-1/config.yml',
        MOCK_FILES_BASEPATH
      );
      const config = qs.getConfigContent();

      expect(config).toBeDefined();
      expect(config.slug).toEqual('template-quickstart');
    });
  });

  describe('getComponents', () => {
    test('Returns empty array when there are no components', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-5/config.yml',
        MOCK_FILES_BASEPATH
      );
      const components = qs.getComponents();

      expect(components).toBeDefined();
      expect(components).toHaveLength(0);
    });

    test('Returns all components', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-2/config.yml',
        MOCK_FILES_BASEPATH
      );
      const components = qs.getComponents();

      expect(components).toBeDefined();
      expect(components).toHaveLength(3);
    });
  });

  describe('getMutationVariables', () => {
    test('Returns variables for quickstart', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-1/config.yml',
        MOCK_FILES_BASEPATH
      );
      const variables = qs.getMutationVariables(true);

      expect(variables).toEqual({
        id: '00000000-0000-0000-0000-000000000000',
        dryRun: true,
        quickstartMetadata: {
          slug: 'template-quickstart',
          displayName: 'Template Quickstart',
          description:
            'The template quickstart allows you to get visibility into the performance and available of your example service and dependencies. Use this quickstart together with the mock up integrations.',
          summary: 'A short form description for this quickstart',
          supportLevel: 'COMMUNITY',
          authors: [{ name: 'John Smith' }],
          keywords: ['list', 'of', 'searchable', 'keywords'],
          categoryTerms: undefined,
          installPlanStepIds: ['mock-install-1'],
          icon: `${GITHUB_RAW_BASE_URL}/quickstarts/mock-quickstart-1/logo.png`,
          sourceUrl: `${GITHUB_REPO_BASE_URL}/quickstarts/mock-quickstart-1`,
          documentation: [
            {
              displayName: 'Installation Docs',
              url: 'docs.newrelic.com',
              description: 'Description about this doc reference',
            },
          ],
        },
      });
    });

    test('Returns variables for quickstart with components', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-2/config.yml',
        MOCK_FILES_BASEPATH
      );
      const variables = qs.getMutationVariables(true);

      expect(variables.id).toEqual('mock-2-id');
      expect(variables.quickstartMetadata.alertConditions).toHaveLength(2);
      expect(variables.quickstartMetadata.dashboards).toHaveLength(1);
      expect(variables.quickstartMetadata.installPlanStepIds).toHaveLength(1);
      expect(variables.quickstartMetadata.dataSourceIds).toHaveLength(1);
    });
  });

  describe('validate', () => {
    beforeEach(() => {
      console.log = jest.fn();
    });

    test('Sets valid when all components are valid', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-2/config.yml',
        MOCK_FILES_BASEPATH
      );
      qs.validate();

      expect(qs.isValid).toBe(true);
    });

    test('Sets invalid when a component is invalid', () => {
      const qs = new Quickstart(
        'quickstarts/mock-quickstart-3/config.yml',
        MOCK_FILES_BASEPATH
      );
      qs.validate();

      expect(qs.isValid).toBe(false);
    });
  });

  describe('getAll', () => {
    test('Returns all quickstarts in directory', () => {
      const quickstarts = Quickstart.getAll(MOCK_FILES_BASEPATH);

      expect(quickstarts).toHaveLength(7);
    });

    test('Handles no quickstarts in directory', () => {
      const quickstarts = Quickstart.getAll('fake-dir');

      expect(quickstarts).toHaveLength(0);
    });
  });
});
