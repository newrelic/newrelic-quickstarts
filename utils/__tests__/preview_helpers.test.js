import { validatePath, removePathPrefixes } from '../preview/previewHelpers';

import * as path from 'path';

describe('Test preview server helper functions', () => {
    test('Test validatePath does not throw for valid paths', () => {
        const parentDirectory = path.resolve(__dirname, '../..');
        const quickstartPaths = [
            'battlesnake', 
            'aws/amazon-athena', 
            'elasticsearch', 
            'quantum-metric',
            'macos',
            'php/cakephp',
        ];

        quickstartPaths.forEach(quickstartPath => {
            expect(
                validatePath(parentDirectory, quickstartPath)
            ).resolves.not.toThrowError();
        });
    });

    test('Test validatePath throws for invalid paths', () => {
        // Arrange
        const mockConsoleError = jest.spyOn(console, 'error')
                                     .mockImplementation(() => {});
        const mockExit = jest.spyOn(process, 'exit')
                             .mockImplementation(() => {});
        const parentDirectory = path.resolve(__dirname, '../..');
        const quickstartPath = 'not/valid';

        // Act
        validatePath(parentDirectory, quickstartPath);

        
        // Assert
        expect(mockConsoleError).toHaveBeenCalled();
        expect(mockExit).toHaveBeenCalledWith(1);
        mockExit.mockRestore();
        mockConsoleError.mockRestore();
    })

    test('Test removePathPrefixes correctly removes /quickstarts from path', () => {
        // Arrange
        const inputPaths = [
            'some/path/quickstarts/ads-web-gpt', 
            'some/other/really/long/path/quickstarts/battlesnake', 
            '/quickstarts/audit/account-data-ingestion-analysis', 
            'Users/mickeyryan/repos/new-relic-quickstarts/quickstarts/aws/amazon-athena', 
            '../quickstarts/elasticsearch'
        ];

        const expectedOutput = [
            'quickstarts/ads-web-gpt', 
            'quickstarts/battlesnake', 
            'quickstarts/audit/account-data-ingestion-analysis', 
            'quickstarts/aws/amazon-athena', 
            'quickstarts/elasticsearch'
        ];

        // Act
        const outputPaths = removePathPrefixes(inputPaths);

        // Assert
        expect(outputPaths).toEqual(expectedOutput);
    });
});
