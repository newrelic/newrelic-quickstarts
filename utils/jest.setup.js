// Jest setup file to handle ESM module compatibility issues

// Mock node-fetch for tests that don't actually need network calls
jest.mock('node-fetch', () => {
  const mockFetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      status: 200,
      json: () => Promise.resolve({}),
    })
  );
  mockFetch.Response = class Response {};
  return {
    __esModule: true,
    default: mockFetch,
    Response: mockFetch.Response,
  };
});

// Mock @actions/core to avoid Node.js compatibility issues in validate_images tests
jest.mock('@actions/core', () => ({
  getInput: jest.fn(),
  setOutput: jest.fn(),
  setFailed: jest.fn(),
  debug: jest.fn(),
  info: jest.fn(),
  warning: jest.fn(),
  error: jest.fn(),
  startGroup: jest.fn(),
  endGroup: jest.fn(),
  isDebug: jest.fn(() => false),
}));
