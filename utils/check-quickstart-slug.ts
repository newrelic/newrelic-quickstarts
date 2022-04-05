import * as path from 'path';

import {
  findMainQuickstartConfigFiles,
  readYamlFile,
  removeRepoPathPrefix,
} from './helpers';
import { readFile, readFileSync } from 'fs';

import fetch from 'node-fetch';
import { writeFile } from 'fs/promises';

type QuickstartConfig = {
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
};

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
 * Logging function for logging information
 * @param info Tuple array containing [similars, diffs]
 */
const printInfo = (results: Array<string>): void => {
  console.log('Number of failed quickstart URLs:', results.length);
  console.log('Failed quickstart URLs:', results);
};

/**
 * Helper function to compare two slugs
 * @param first slug to compare
 * @param second slug to compare
 * @returns Boolean results of slugs equality
 */
const isSlugSame = (first: string, second: string): boolean => first === second;

/**
 *
 * @param diffs Array of tuples containing the relative path in quickstart repo
 * and contains content inside `config.yaml` where `name` and `title` differ.
 * @returns Promise of failed quickstart paths.
 */
const checkUrlResponse = (
  diffs: Array<[string, QuickstartConfig]>
): Promise<string[]> => {
  const SITE_URL: string = 'https://newrelic.com/instant-observability';

  const fetchResults = diffs.map(async (tuple) => {
    const [quickstartPath, contents] = tuple;
    const resp = await fetch(`${SITE_URL}/${contents.name}/${contents.id}`);
    if (!resp.ok || resp.status === 404) {
      return quickstartPath;
    }
  });
  return Promise.all(fetchResults);
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

    const { name, title } = yaml.contents[0];
    const slugName = slugify(name);
    const slugTitle = slugify(title);

    !isSlugSame(slugName, slugTitle)
      ? diffs.push([filename, yaml.contents[0]])
      : similars.push([filename, yaml.contents[0]]);
  });
};

const fixConfig = (rawConfig: string, title: string): string => {
  return rawConfig.replace(/^name:.*$/m, `name: ${title}`);
};

const fixQuickstarts = (results: Array<string>): Promise<Boolean[]> => {
  const fixedQuickstarts = results.map(async (quickstartPath) => {
    const yaml: YamlFile = readYamlFile(
      path.join(process.cwd(), `../${quickstartPath}`)
    ) as YamlFile;
    const config: QuickstartConfig = yaml.contents[0];
    config.name = config.title;
    try {
      const filePath = path.resolve('..', quickstartPath);
      const rawConfig = readFileSync(filePath, { encoding: 'utf8' });
      const fixedConfig = fixConfig(rawConfig, config.title);
      const writePromise = writeFile(filePath, fixedConfig);
      await writePromise;

      return true;
    } catch (error) {
      console.log('ERROR', error);
      return false;
    }
  });
  return Promise.all(fixedQuickstarts);
};

/**
 * 'Main' function of `check-quickstart-slug`. Function handles the logic
 * and workflow for retreiving failed quickstart URLs using the `name` field
 * in `config.yaml`.
 */
export const getFailedQuickstartURLs = async (): Promise<void> => {
  // Optional commandline argument to log out information
  const TESTING = Boolean(process.argv[2]);
  const diffs: Array<[string, QuickstartConfig]> = [];
  const similars: Array<[string, QuickstartConfig]> = [];

  const filePaths = findMainQuickstartConfigFiles();
  iterateQuickstarts(filePaths, diffs, similars);

  const responses = await checkUrlResponse(diffs);
  const results = responses.filter(Boolean);

  if (TESTING) {
    printInfo(results);
  }

  if (results.length > 0) {
    fixQuickstarts(results);
  }
};

if (require.main === module) getFailedQuickstartURLs();
