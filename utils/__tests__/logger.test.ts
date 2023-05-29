import logger from '../logger';

jest.spyOn(console, 'log').mockImplementation(jest.fn());

describe('logger', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('Defaults to INFO level', () => {
    process.env.LOG_LEVEL = '';

    logger.info('test');
    expect(console.log).toHaveBeenCalledTimes(1);
  });

  test('Does not log at a level higher than set', () => {
    process.env.LOG_LEVEL = 'INFO';

    logger.debug('test');
    expect(console.log).toHaveBeenCalledTimes(0);
  });
});
