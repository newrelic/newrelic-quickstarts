import fetch from 'node-fetch';
import {
  fetchPaginatedGHResults,
  filterOutTestFiles,
  isNotRemoved,
} from './lib/github-api-helpers';

const regexAndWarning: [RegExp, string][] = [
  [/guid[`'"\) ]/, `\"guid\" should not be used`],
  [/entityGuid/, `\"entityGuid\" should not be used`],
  [/\"linkedEntityGuids\": (?:(?!null))/, `\"entityGuid\" should not be used`],
  [/\"permissions\": /, `\"permissions\" field should not be used`],
  [/\"accountId\": (?:(?!0))/, `\"accountId\" must be zero`],
  [
    /\"accountIds\"\s*:\s\[(?!\s*])([^\]\[]+)\]/,
    `\"accountIds\" must be set to []`,
  ],
];

export const checkLine = (line: string) => {
  const warningsFound = [];
  for (const [regex, warning] of regexAndWarning) {
    if (regex.test(line)) {
      warningsFound.push(warning);
    }
  }
  return warningsFound;
};

const encodedNewline = '%0A';
export const createWarningComment = (warnings: string[]) => {
  const commentMessage = [
    `### The PR checks have run and found the following warnings:${encodedNewline}`,
  ];

  const tableHeader = `| Warning | Filepath | Line # | ${encodedNewline}| --- | --- | --- | `;
  commentMessage.push(tableHeader);

  warnings.forEach((w) => commentMessage.push(w));

  const linkToDocs = `${encodedNewline}Reference the [Contributing Docs for Dashboards](https://github.com/newrelic/newrelic-quickstarts/blob/main/CONTRIBUTING.md#dashboards) for more information. ${encodedNewline}`;
  commentMessage.push(linkToDocs);

  return commentMessage.join(encodedNewline);
};

export const runHelper = async (
  prUrl?: string,
  token?: string
): Promise<string> => {
  let warningComment = '';

  if (!token) {
    console.error(`Missing GITHUB_TOKEN environment variable`);
    return '';
  }

  if (!prUrl) {
    console.error(
      `Missing arguments. Example: ts-node dashboard-helper.ts <pull request url>`
    );
    return '';
  }

  const warnings: string[] = [];

  const files = await fetchPaginatedGHResults(new URL(prUrl).href, token);

  const dashboardFileRegEx = /^dashboards\/\S*\.json$/;
  const dashboardsInPR = filterOutTestFiles(files)
    .filter(isNotRemoved)
    .filter(({ filename }) => dashboardFileRegEx.test(filename));

  for (const dash of dashboardsInPR) {
    try {
      const response = await fetch(dash.raw_url, {
        headers: { authorization: `token ${token}` },
      });
      if (!response.ok) {
        throw new Error(`${response.status} - ${dash.raw_url}`);
      }
      const responseJSON = await response.json();

      const dashLines = JSON.stringify(responseJSON, null, 2).split('\n');

      dashLines.forEach((line, lineNumber) => {
        const output = checkLine(line);
        if (output.length > 0) {
          output.forEach((o) =>
            warnings.push(`| ${o} | ${dash.filename} | ${lineNumber + 1} |`)
          );
        }
      });
    } catch (error: any) {
      console.error('Error:', error.message);
      return '';
    }
  }

  if (warnings.length > 0) {
    console.log('Found warnings:', warnings);
    warningComment = createWarningComment(warnings);
  }

  return warningComment;
};

/**
 * Gathers environment variables and arguments, then executes the script
 */
const main = async () => {
  const isSuccess = await runHelper(process.argv[2], process.env.GITHUB_TOKEN);

  if (!isSuccess) {
    process.exit(1);
  }
};

/**
 * This allows us to check if the script was invoked directly from the command line, i.e 'ts-node dashboard-helper.ts', or if it was imported.
 * This would be true if this was used in one of our GitHub workflows, but false when imported for use in a test.
 * See here: https://nodejs.org/docs/latest/api/modules.html#modules_accessing_the_main_module
 */
if (require.main === module) {
  main();
}
