import { isPathValid } from '../preview';

import * as path from 'path';

describe('Test preview server helper functions', () => {
  test('Test isPathValid returns true for valid paths', () => {
    const parentDirectory = path.resolve(__dirname, '../mock_files');
    const quickstartPaths = [
      'quickstarts/mock-quickstart-1',
      'quickstarts/mock-quickstart-2',
      'quickstarts/mock-quickstart-3',
      'quickstarts/mock-quickstart-4',
      'quickstarts/mock-quickstart-5',
      'quickstarts/mock-quickstart-6',
      'quickstarts/mock-quickstart-7/nested-quickstart',
    ];

    for (const qs of quickstartPaths) {
      const isValid = isPathValid(parentDirectory, qs);
      expect(isValid).toBe(true);
    }
  });

  test('Test isPathValid calls console.error', () => {
    // Arrange
    const mockConsoleError = jest
      .spyOn(console, 'error')
      .mockImplementation(() => {});
    const parentDirectory = path.resolve(__dirname, '../mock_files');
    const quickstartPath = 'not/valid';

    // Act
    const isValid = isPathValid(parentDirectory, quickstartPath);

    // Assert
    expect(isValid).toBe(false);
    expect(mockConsoleError).toHaveBeenCalled();
    mockConsoleError.mockRestore();
  });
});
