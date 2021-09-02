const path = require('path');
const fetch = require('node-fetch');
const parseLinkHeader = require('parse-link-header');
const {
  readYamlFile,
  checkArgs,
  removeRepoPathPrefix,
  findMainPackConfigFiles,
} = require('./helpers');

const fetchFilesFromGH = async (url) => {
  let files = [];
  let nextPageLink = url;

  while (nextPageLink) {
    const resp = await fetch(nextPageLink, {
      headers: { authorization: `token ${process.env.GITHUB_TOKEN}` },
    });
    if (!resp.ok) {
      throw new Error(
        `Github API returned status ${resp.code} - ${resp.message}`
      );
    }
    const page = await resp.json();
    nextPageLink = getNextLink(resp.headers.get('Link'));
    files = [...files, ...page];
  }

  return files;
};

const getNextLink = (linkHeader) => {
  const parsedLinkHeader = parseLinkHeader(linkHeader);
  if (parsedLinkHeader && parsedLinkHeader.next) {
    return parsedLinkHeader.next.url || null;
  }
  return null;
};

const findSupportLevel = async (url) => {
  let newPack = false;

  const files = await fetchFilesFromGH(url);

  const configFiles = findMainPackConfigFiles();
  files.forEach((file) => {
    if (file.filename.includes('config.yml') && file.status === 'added') {
      newPack = true;
    }
  });

  const configFilesToRead = configFiles
    .map((config) => {
      const configRelativePath = removeRepoPathPrefix(config);
      const regex = new RegExp(`^${path.dirname(configRelativePath)}.*`);
      const fileMatch = files.find((file) => file.filename.match(regex));

      return fileMatch !== undefined && config;
    })
    .filter(Boolean);

  const supportLevelSet = new Set();

  configFilesToRead.forEach((configFile) => {
    const parsedConfig = readYamlFile(configFile);
    const supportLevel = parsedConfig.contents[0].level;
    if (supportLevel) {
      const validSupportLevels = ['New Relic', 'Verified', 'Community'];
      if (validSupportLevels.includes(supportLevel)) {
        supportLevelSet.add(parsedConfig.contents[0].level);
      }
    }
  });

  const supportLevelArray = Array.from(supportLevelSet);

  console.log(`::set-output name=addition::${newPack}`);

  if (supportLevelArray.includes('New Relic')) {
    console.log('::set-output name=newrelic::true');
  }
  if (supportLevelArray.includes('Verified')) {
    console.log('::set-output name=verified::true');
  }
  if (
    supportLevelArray.includes('Community') ||
    supportLevelArray.length === 0
  ) {
    console.log('::set-output name=community::true');
  }
};

const main = async () => {
  try {
    checkArgs(3);
    const url = process.argv[2];
    await findSupportLevel(url);
    process.exit(0);
  } catch (error) {
    console.log(error);
    process.exit(1);
  }
};

if (require.main === module) {
  main();
}

module.exports = main;
