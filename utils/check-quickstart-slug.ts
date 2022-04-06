import * as path from 'path';

import {
  findMainQuickstartConfigFiles,
  readYamlFile,
  removeRepoPathPrefix,
} from './helpers';

import fetch from 'node-fetch';
import { readFileSync } from 'fs';
import { writeFile } from 'fs/promises';

export interface QuickstartConfig {
  id: string;
  name: string;
  description: string;
  summary: string;
  logo: string;
  level: string;
  authors: Array<string>;
  title: string;
  documentation: Array<string>;
  keywords: Array<string>;
  installPlans: Array<string>;
}

interface YamlFile {
  path: string;
  contents: QuickstartConfig[];
}

/**
 * Helper function that slugifies a string for URL usage.
 * @param str string to slugify
 * @returns slugified string
 */
const slugify = (str: string): string =>
  str
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '-')
    .replace(/-+/, '-')
    .replace(/[^a-z0-9-]/g, '');

/**
 * Helper function to compare two slugs
 * @param first slug to compare
 * @param second slug to compare
 * @returns Boolean results of slugs equality
 */
const isSlugSame = (first: string, second: string): boolean => first === second;

/**
 * Function replaces first regex match and replaces name with title
 * @param rawConfig - raw buffer from fs.readFileSync
 * @param title - title of quickstart from config
 * @returns
 */
const fixConfig = (rawConfig: string, title: string): string => {
  return rawConfig.replace(/^name:.*$/m, `name: ${slugify(title)}`);
};

/**
 * Logging function for logging information
 * @param info Tuple array containing [similars, diffs]
 */
const printInfo = (results: Array<string>): void => {
  console.log('Number of failed quickstart URLs:', results.length);
  console.log('Failed quickstart URLs:', results);
};

/**
 *
 * @param diffs Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` differ.
 * @returns Promise of failed quickstart paths.
 */
export const checkUrlResponse = (
  diffs: Array<[string, QuickstartConfig]>
): Promise<string[]> => {
  const SITE_URL: string = 'https://newrelic.com/instant-observability';

  const fetchResults: Promise<string>[] = diffs.map(async (tuple) => {
    const [quickstartPath, contents] = tuple;
    const resp = await fetch(`${SITE_URL}/${contents.name}/${contents.id}`);
    if (!resp.ok || resp.status === 404) {
      return quickstartPath;
    }
  });
  return Promise.all(fetchResults);
};

export const fixQuickstarts = (
  failedQuickstarts: Array<string>
): Promise<Boolean[]> => {
  const fixedQuickstarts = failedQuickstarts.map(async (quickstartPath) => {
    // read config yaml file
    const yaml: YamlFile = readYamlFile(
      path.join(process.cwd(), `../${quickstartPath}`)
    ) as YamlFile;

    // grab the contents of the config
    const config: QuickstartConfig = yaml.contents[0];

    try {
      const filePath = path.resolve('..', quickstartPath);

      // get the raw config from readFileSync
      const rawConfig = readFileSync(filePath, { encoding: 'utf8' });

      // replace name with title
      const fixedConfig = fixConfig(rawConfig, config.title);

      // write to file
      const writePromise = writeFile(filePath, fixedConfig);
      await writePromise;

      return true;
    } catch (error) {
      console.log(
        `Quickstart "${config.title}" has not been updated:\n`,
        error
      );
      return false;
    }
  });
  return Promise.all(fixedQuickstarts);
};

/**
 * Functions handles reading all quickstarts and performing two actions:
 *
 * 1) Push quickstarts with the same `name` and `title` into `similars` array
 * 2) Push quickstarts with different `name` and `title` into `diffs` array
 * @param filePaths Path to all top level quickstart configs
 * @param diffs Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` differ.
 * @param similars Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` are the same.
 */
export const iterateQuickstarts = (
  filePaths: Array<string>,
  diffs: Array<[string, QuickstartConfig]>,
  similars: Array<[string, QuickstartConfig]>
): void => {
  filePaths.forEach((quickstartPath) => {
    const filename: string = removeRepoPathPrefix(quickstartPath);

    const yaml: YamlFile = readYamlFile(
      path.join(process.cwd(), `../${filename}`)
    ) as YamlFile;

    const { name, title }: QuickstartConfig = yaml.contents[0];
    const slugTitle: string = slugify(title);

    // we only send in `name` to make sure the service receives a slugified
    // field
    !isSlugSame(name, slugTitle)
      ? diffs.push([filename, yaml.contents[0]])
      : similars.push([filename, yaml.contents[0]]);
  });
};

/**
 * Function handles the logic for retreiving failed
 * quickstart URLs using the `name` field in `config.yaml`.
 * @param diffs Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` differ.
 * @param similars Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` are the same.
 * @returns
 */
export const getFailedQuickstartURLs = async (
  diffs: Array<[string, QuickstartConfig]>,
  similars: Array<[string, QuickstartConfig]>
): Promise<string[]> => {
  const filePaths = findMainQuickstartConfigFiles();
  iterateQuickstarts(filePaths, diffs, similars);

  // check the URLs of all quickstarts that have different name and title
  const diffsResponse = await checkUrlResponse(diffs);

  // check
  const similarResponse = await checkUrlResponse(similars);
  const diffsResults = diffsResponse.filter(Boolean);
  const similarResults = similarResponse.filter(Boolean);

  return Promise.resolve([...diffsResults, ...similarResults]);
};

const main = async (): Promise<void> => {
  // Optional commandline argument to log out information
  const TESTING = Boolean(process.argv[2]);
  const diffs: Array<[string, QuickstartConfig]> = [];
  const similars: Array<[string, QuickstartConfig]> = [];
  const failedQuickstarts = await getFailedQuickstartURLs(diffs, similars);

  if (TESTING) {
    printInfo(failedQuickstarts);
  }

  if (failedQuickstarts.length > 0) {
    fixQuickstarts(failedQuickstarts);
  }
};

if (require.main === module) main();
