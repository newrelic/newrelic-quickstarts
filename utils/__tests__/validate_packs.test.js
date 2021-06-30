const {
  validateFile,
  convertErrors,
  printErrors,
} = require('../validate_packs');

jest.spyOn(global.console, 'log').mockImplementation(() => {});
jest.spyOn(global.console, 'error').mockImplementation(() => {});

const getTestFile = (schemaType) => {
  const files = {
    alert: {
      path: '/alerts/',
      contents: [
        {
          name: 'fakealert',
          type: 'STATIC',
          nrql: {
            query:
              "FROM ElasticsearchClusterSample SELECT uniqueCount(displayName) WHERE cluster.status = 'red' FACET displayName",
          },
        },
      ],
    },
    dashboard: {
      path: '/dashboards/',
      contents: [
        {
          name: 'fakedashboard',
        },
      ],
    },
    flex: {
      path: '/instrumentation/flex/',
      contents: [
        {
          name: 'fakeflexconfig',
        },
        {
          integrations: [],
        },
      ],
    },
    synthetic: {
      path: '/instrumentation/synthetics',
      contents: [
        {
          name: 'fakesynthetic',
        },
      ],
    },
    main_config: {
      path: '/main_config/', // this can be any path
      contents: [
        {
          name: 'fakeobservabilitypack',
        },
      ],
    },
  };

  return files[schemaType];
};

describe('test validateFile', () => {
  describe('alert validation', () => {
    test.each`
      type
      ${'STATIC'}
      ${'BASELINE'}
      ${'OUTLIER'}
    `('doesnt fail for a valid alert definition', ({ type }) => {
      const alertTestFile = getTestFile('alert');
      alertTestFile.contents[0].type = type;

      const { errors } = validateFile(alertTestFile);

      expect(errors).toEqual([]);
    });

    test('detects empty alert definition', () => {
      const alertTestFile = getTestFile('alert');
      alertTestFile.contents = [{}];

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects alert definition that is missing name', () => {
      const alertTestFile = getTestFile('alert');
      delete alertTestFile.contents[0].name;

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects alert definition that is missing type', () => {
      const alertTestFile = getTestFile('alert');
      delete alertTestFile.contents[0].type;

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects alert definition with non-allowed type', () => {
      const alertTestFile = getTestFile('alert');
      alertTestFile.contents[0].type = 'INVALID_TYPE';

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects alert definition that is missing nrql', () => {
      const alertTestFile = getTestFile('alert');
      delete alertTestFile.contents[0].nrql;

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects alert definition that is missing nrql.query', () => {
      const alertTestFile = getTestFile('alert');
      delete alertTestFile.contents[0].nrql.query;

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects alert definition that is missing multiple fields', () => {
      const alertTestFile = getTestFile('alert');
      delete alertTestFile.contents[0].name;
      delete alertTestFile.contents[0].type;
      delete alertTestFile.contents[0].nrql;

      const { errors } = validateFile(alertTestFile);

      expect(errors.length).toBe(3);
    });
  });

  describe('dashboard validation', () => {
    test('doesnt fail for valid dashboard definition', () => {
      const dashboardTestFile = getTestFile('dashboard');

      const { errors } = validateFile(dashboardTestFile);

      expect(errors).toEqual([]);
    });

    test('detects empty dashboard definition', () => {
      const dashboardTestFile = getTestFile('dashboard');
      dashboardTestFile.contents = [{}];

      const { errors } = validateFile(dashboardTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects dashboard definition that is missing name', () => {
      const dashboardTestFile = getTestFile('dashboard');
      delete dashboardTestFile.contents[0].name;

      const { errors } = validateFile(dashboardTestFile);

      expect(errors.length).toBe(1);
    });
  });

  describe('flex validation', () => {
    test('doesnt fail for valid flex definition', () => {
      const flexTestFile = getTestFile('flex');

      const { errors } = validateFile(flexTestFile);

      expect(errors).toEqual([]);
    });

    test('detects empty flex config', () => {
      const flexTestFile = getTestFile('flex');
      flexTestFile.contents[0] = {}; // contents[0] is the config

      const { errors } = validateFile(flexTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects empty flex integration', () => {
      const flexTestFile = getTestFile('flex');
      flexTestFile.contents[1] = {}; // contents[1] is the integration

      const { errors } = validateFile(flexTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects flex config definition that is missing name', () => {
      const flexTestFile = getTestFile('flex');
      delete flexTestFile.contents[0].name;

      const { errors } = validateFile(flexTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects flex integration definition that is missing integrations', () => {
      const flexTestFile = getTestFile('flex');
      delete flexTestFile.contents[1].integrations;

      const { errors } = validateFile(flexTestFile);

      expect(errors.length).toBe(1);
    });
  });

  describe('synthetic validation', () => {
    test('doesnt fail for valid synthetic definition', () => {
      const syntheticTestFile = getTestFile('synthetic');

      const { errors } = validateFile(syntheticTestFile);

      expect(errors).toEqual([]);
    });

    test('detects empty synthetic definition', () => {
      const syntheticTestFile = getTestFile('synthetic');
      syntheticTestFile.contents = [{}];

      const { errors } = validateFile(syntheticTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects synthetic definition that is missing name', () => {
      const syntheticTestFile = getTestFile('synthetic');
      delete syntheticTestFile.contents[0].name;

      const { errors } = validateFile(syntheticTestFile);

      expect(errors.length).toBe(1);
    });
  });

  describe('main config validation', () => {
    test.each`
      level
      ${'New Relic'}
      ${'Verified'}
      ${'Community'}
    `('doesnt fail for a valid alert definition', ({ level }) => {
      const mainConfigTestFile = getTestFile('main_config');
      mainConfigTestFile.contents[0].level = level;

      const { errors } = validateFile(mainConfigTestFile);

      expect(errors).toEqual([]);
    });

    test('doesnt fail for valid alert definition w/o non-required fields', () => {
      const mainConfigTestFile = getTestFile('main_config');

      const { errors } = validateFile(mainConfigTestFile);

      expect(errors).toEqual([]);
    });

    test('detects empty main config definition', () => {
      const mainConfigTestFile = getTestFile('main_config');
      mainConfigTestFile.contents = [{}];

      const { errors } = validateFile(mainConfigTestFile);

      expect(errors.length).toBeGreaterThan(0);
    });

    test('detects main config definition that is missing name', () => {
      const mainConfigTestFile = getTestFile('main_config');
      delete mainConfigTestFile.contents[0].name;

      const { errors } = validateFile(mainConfigTestFile);

      expect(errors.length).toBe(1);
    });

    test('detects invalid values for level field', () => {
      const mainConfigTestFile = getTestFile('main_config');
      mainConfigTestFile.contents[0].level = 'INVALID_TYPE';

      const { errors } = validateFile(mainConfigTestFile);

      expect(errors.length).toBe(1);
    });
  });
});

describe('test convertErrors', () => {
  test('converts enum error message', () => {
    const mockAjvErrors = [
      {
        instancePath: '/type',
        schemaPath: '#/properties/type/enum',
        keyword: 'enum',
        params: { allowedValues: ['STATIC', 'BASELINE', 'OUTLIER'] },
        message: 'must be equal to one of the allowed values',
      },
    ];

    const [convertedError, ..._] = convertErrors(mockAjvErrors);

    expect(convertedError.message).toBe(
      `'/type' must be equal to one of the allowed values: ["STATIC","BASELINE","OUTLIER"]`
    );
  });

  test('converts missing required field error message on a nested property', () => {
    /* 
      previously if a field 'nrql' has a required field 'query', the message was: "must have required property 'query'".
      there was no information about what level 'query' lived at (i.e, where does it go).
      now it should look something like: "'/nrql' must have required property 'query'".
      this should also be the case for fields nested beyond one level deep.
    */

    const mockAjvErrors = [
      {
        instancePath: '/nrql',
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'query' },
        message: "must have required property 'query'",
      },
    ];

    const [convertedError, ..._] = convertErrors(mockAjvErrors);

    expect(convertedError.message).toBe(
      `'/nrql' must have required property 'query'`
    );
  });

  // 'default' is anything except enum, and a missing required field on a nested field.
  test('returns exact message for default case', () => {
    const mockAjvErrors = [
      {
        instancePath: '',
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'name' },
        message: "must have required property 'name'",
      },
    ];

    const [convertedError, ..._] = convertErrors(mockAjvErrors);

    expect(convertedError.message).toBe("must have required property 'name'");
  });

  test('removes fields that are not message', () => {
    const mockAjvErrors = [
      {
        instancePath: '/type',
        schemaPath: '#/properties/type/enum',
        keyword: 'enum',
        params: { allowedValues: ['STATIC', 'BASELINE', 'OUTLIER'] },
        message: 'must be equal to one of the allowed values',
      },
      {
        instancePath: '',
        schemaPath: '#/required',
        keyword: 'required',
        params: { missingProperty: 'name' },
        message: "must have required property 'name'",
      },
    ];

    const convertedErrors = convertErrors(mockAjvErrors);

    expect(convertedErrors).toEqual([
      {
        message: `'/type' must be equal to one of the allowed values: ["STATIC","BASELINE","OUTLIER"]`,
      },
      {
        message: "must have required property 'name'",
      },
    ]);
  });
});

describe('test printErrors', () => {
  beforeEach(() => {
    jest.resetAllMocks();
  });

  test('displays correct output', () => {
    const mockFileErrors = [
      {
        path: `newrelic-observability-packs/fake_path`,
        errors: [
          {
            message: `'/type' must be equal to one of the allowed values: ["STATIC","BASELINE","OUTLIER"]`,
          },
          {
            message: "must have required property 'name'",
          },
        ],
      },
      {
        path: `newrelic-observability-packs/fake_path_2`,
        errors: [
          {
            message: `'/type' must be equal to one of the allowed values: ["RED","BLUE","GREEN"]`,
          },
          {
            message: "must have required property 'ball'",
          },
        ],
      },
    ];

    printErrors(mockFileErrors);

    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      `\nError: fake_path\n\t '/type' must be equal to one of the allowed values: [\"STATIC\",\"BASELINE\",\"OUTLIER\"]\n\t must have required property 'name'`
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      2,
      `\nError: fake_path_2\n\t '/type' must be equal to one of the allowed values: [\"RED\",\"BLUE\",\"GREEN\"]\n\t must have required property 'ball'`
    );
  });
});
