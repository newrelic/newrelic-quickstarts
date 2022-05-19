import { isPathValid } from '../preview';

import * as path from 'path';

describe('Test preview server helper functions', () => {
    test('Test isPathValid returns true for valid paths', async () => {
        const parentDirectory = path.resolve(__dirname, '../mock_files');
        const quickstartPaths = [
            'mock-quickstart-1',
            'mock-quickstart-2',
            'mock-quickstart-3',
            'mock-quickstart-4',
            'mock-quickstart-5',
            'mock-quickstart-6',
            'mock-quickstart-7/nested-quickstart'
        ];
       
        for (const qs of quickstartPaths) {
          const isValid = await isPathValid(parentDirectory, qs);
          expect(isValid).toBe(true);
        }
    });

    test('Test isPathValid calls console.error', () => {
        // Arrange
        const mockConsoleError = jest.spyOn(console, 'error')
                                     .mockImplementation(() => {});
        const parentDirectory = path.resolve(__dirname, '../mock_files');
        const quickstartPath = 'not/valid';

        // Act
        isPathValid(parentDirectory, quickstartPath);

        // Assert
        expect(mockConsoleError).toHaveBeenCalled();
        mockConsoleError.mockRestore();
    })
});
