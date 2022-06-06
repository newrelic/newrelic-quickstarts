const { validateImageCounts } = require('../validate_images');
const core = require('@actions/core');
const path = require('path');

jest.mock('@actions/core');
jest.spyOn(global.console, 'warn').mockImplementation(() => {});

describe('Action: validate images on file system', () => {
  test('validateImagaCounts, given 0 dashboads, does not throw an error', () => {
    const globMock = [
      path.resolve(__dirname, '../mock_files/mock-quickstarts/mock-quickstart-6/config.yml'),
    ];
    validateImageCounts(globMock);
    expect(core.setFailed).not.toHaveBeenCalled();
    expect(global.console.warn).not.toHaveBeenCalled();
  });
});
