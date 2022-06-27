const mockFilenamesDuplicatedDirectory = [
  'quickstarts/foo/duplicate-directory-name/config.yml',
  'quickstarts/foo/duplicate-directory-name/alerts/baseline-alert.yml',
  'quickstarts/bar/duplicate-directory-name/config.yml',
  'quickstarts/bar/duplicate-directory-name/alerts/baseline-alert.yml',
];

const mockFilenamesTestQS1 = [
  'quickstarts/test-quickstart-folder/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder/config.yml',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder/icon.jpeg',
  'quickstarts/test-quickstart-folder/images/icon.jpeg',
];
const mockFilenamesTestQS2 = [
  'quickstarts/test-quickstart-folder-2/logo.png',
  'quickstarts/test-quickstart-folder-2/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder-2/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder-2/config.yml',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder-2/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
];

const mockGitHubResponseFilenames = [
  ...mockFilenamesDuplicatedDirectory,
  ...mockFilenamesTestQS1,
  ...mockFilenamesTestQS2,
  'quickstarts/python/aiohttp/alerts/ApdexScore.yml',
  'quickstarts/python/pysqlite/dashboards/python.json',
  'quickstarts/python/pysqlite/logo.svg',
  '.github/workflows/validate_packs.yml',
  'utils/__tests__/validate_install_plans.test.js',
  'utils/github-api-helpers.js',
  'utils/helpers.js',
  'utils/package.json',
  'utils/validate-install-plan.js',
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
