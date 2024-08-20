const mockFilenamesDuplicatedDirectory = [
  'quickstarts/foo/duplicate-directory-name/config.yml',
  'alert-policies/foo/duplicate-directory-name/baseline-alert.yml',
  'quickstarts/bar/duplicate-directory-name/config.yml',
  'alert-policies/bar/duplicate-directory-name/baseline-alert.yml',
];

const mockFilenamesTestQS1 = [
  'alert-policies/test-quickstart-folder/baseline-alert.yml',
  'alert-policies/test-quickstart-folder/static-alert.yml',
  'quickstarts/test-quickstart-folder/config.yml',
  'dashbaords/test-quickstart-folder/my-dashboard.json',
  'dashboards/test-quickstart-folder/my-dashboard.png',
  'quickstarts/test-quickstart-folder/icon.jpeg',
  'quickstarts/test-quickstart-folder/images/icon.jpeg',
];
const mockFilenamesTestQS2 = [
  'quickstarts/test-quickstart-folder-2/logo.png',
  'alert-policies/test-quickstart-folder-2/baseline-alert.yml',
  'alert-policies/test-quickstart-folder-2/static-alert.yml',
  'quickstarts/test-quickstart-folder-2/config.yml',
  'dashboards/test-quickstart-folder-2/my-dashboard.json',
  'dashboards/test-quickstart-folder-2/my-dashboard.png',
  'quickstarts/test-quickstart-folder-2/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
];

const mockGitHubResponseFilenames = [
  ...mockFilenamesDuplicatedDirectory,
  ...mockFilenamesTestQS1,
  ...mockFilenamesTestQS2,
  'alerts/python/aiohttp/ApdexScore.yml',
  'dashboards/python/pysqlite/python.json',
  'quickstarts/python/pysqlite/logo.svg',
  '.github/workflows/validate_packs.yml',
  'utils/__tests__/validate_install_plans.test.js',
  'utils/lib/github-api-helpers.js',
  'utils/helpers.js',
  'utils/package.json',
  'utils/yarn.lock',
];

const addFilenameObject = (filename) => ({ filename });

module.exports = {
  mockFilenamesDuplicatedDirectory,
  mockFilenamesTestQS1,
  mockFilenamesTestQS2,
  mockGitHubResponseFilenames,
  addFilenameObject,
};
