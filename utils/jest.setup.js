// Jest setup file for mocking external dependencies

// Mock @actions/core to prevent GitHub Actions side effects during tests
jest.mock('@actions/core', () => ({
  setFailed: jest.fn(),
  warning: jest.fn(),
  info: jest.fn(),
  debug: jest.fn(),
  error: jest.fn(),
  getInput: jest.fn(),
  setOutput: jest.fn(),
}));
