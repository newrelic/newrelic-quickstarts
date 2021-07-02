const fs = require('fs');
const fetch = require('node-fetch');
const glob = require('glob');

const findSupportLevel = require('../check_support_level');

jest.mock('node-fetch');
jest.mock('glob');
jest.mock('fs');
jest.mock('../helpers', () => ({
  ...jest.requireActual('../helpers'),
  checkArgs: jest.fn(),
}));

global.process.exit = jest.fn();
global.console.log = jest.fn();

const mockGithubResponse = (result) => {
  fetch.mockResolvedValueOnce({
    ok: true,
    json: jest.fn(() => Promise.resolve(result)),
    headers: { get: jest.fn() },
  });
};

const mockGlobSync = () => glob.sync.mockReturnValue('burrito');

const mockReadFileSync = (supportLevel, name = 'Taco') => {
  const yml = `
name: ${name}
level: ${supportLevel}
`;

  fs.readFileSync.mockReturnValueOnce(yml);
};

const STATUS = {
  ADDED: 'added',
  MODIFIED: 'modified',
  REMOVED: 'removed',
};

describe('Action: Check support level', () => {
  afterEach(() => {
    jest.resetAllMocks();
  });

  test('should return true when a new pack is added', async () => {
    const filename = 'packs/taco/config.yml';
    mockGithubResponse([
      {
        filename,
        status: STATUS.ADDED,
      },
    ]);
    mockGlobSync();
    mockReadFileSync('New Relic');

    await findSupportLevel();

    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      '::set-output name=addition::true'
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      2,
      '::set-output name=newrelic::true'
    );
  });

  test('should log multiple labels if updating packs of multiple support levels', async () => {
    mockGithubResponse([
      {
        filename: 'packs/taco/config.yml',
        status: STATUS.MODIFIED,
      },
      {
        filename: 'packs/burrito/config.yml',
        status: STATUS.MODIFIED,
      },
    ]);
    mockGlobSync();
    mockReadFileSync('New Relic', 'Taco');
    mockReadFileSync('Community', 'Burrito');

    await findSupportLevel();

    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      '::set-output name=addition::false'
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      2,
      '::set-output name=newrelic::true'
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      3,
      '::set-output name=community::true'
    );
  });

  test.each`
    level
    ${'New Relic'}
    ${'Verified'}
    ${'Community'}
  `('should return the correct support level for $level', async ({ level }) => {
    const filename = 'packs/taco/config.yml';
    mockGithubResponse([
      {
        filename,
        status: STATUS.MODIFIED,
      },
    ]);
    mockGlobSync();
    mockReadFileSync(level);

    await findSupportLevel();

    expect(global.console.log).toHaveBeenNthCalledWith(
      1,
      '::set-output name=addition::false'
    );
    expect(global.console.log).toHaveBeenNthCalledWith(
      2,
      `::set-output name=${level.toLowerCase().replace(' ', '')}::true`
    );
  });
});
