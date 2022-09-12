import Dashboard from './lib/Dashboard';
import { fetchPaginatedGHResults } from './lib/github-api-helpers';

const guidRegex = /guid[`'"\) ]/;
const entityGuidRegex = /entityGuid/;
const guidFieldRegex = /\"linkedEntityGuids\": (?:(?!null))/;
const permissionsFieldRegex = /\"permissions\": /;
const accountIdRegEx = /\"accountId\": (?:(?!0))/;

const checkLine = (line: string) => {
  const warningsFound = [];

  if (guidRegex.test(line)) {
    warningsFound.push(`\"guid\" should not be used`);
  }
  if (entityGuidRegex.test(line)) {
    warningsFound.push(`\"entityGuid\" should not be used`);
  }
  if (guidFieldRegex.test(line)) {
    warningsFound.push(`\"guid\" field should not be used`);
  }
  if (permissionsFieldRegex.test(line)) {
    warningsFound.push(`\"permissions\" field should not be used`);
  }
  if (accountIdRegEx.test(line)) {
    warningsFound.push(`\"accountId\" must be zero`);
  }

  return warningsFound;
};

const encodedNewline = '%0A';
const createWarningComment = (warnings: string[]) => {
  const commentMessage = [
    `### The PR checks have run and found the following warnings:${encodedNewline}`,
  ];
  const tableHeader = `| Warning | Filepath | Line # | ${encodedNewline}| --- | --- | --- | `;
  commentMessage.push(tableHeader);
  warnings.forEach((w) => commentMessage.push(w));
  return commentMessage.join(encodedNewline);
};

const runHelper = async (prUrl?: string, token?: string): Promise<boolean> => {
  if (!token) {
    console.error(`Missing GITHUB_TOKEN environment variable`);
    return false;
  }

  if (!prUrl) {
    console.error(
      `Missing arguments. Example: ts-node dashboard-helper.ts <pull request url>`
    );
    return false;
  }

  const dashboards = Dashboard.getAll();
  const warnings: string[] = [];

  const files = await fetchPaginatedGHResults(
    new URL(`/files`, prUrl).href,
    token
  );

  for (const dash of dashboards) {
    const dashLines = JSON.stringify(dash.config, null, 2).split('\n');

    dashLines.forEach((line, lineNumber) => {
      const output = checkLine(line);
      if (output.length > 0) {
        output.forEach((o) =>
          warnings.push(`| ${o} | ${dash.configPath} | ${lineNumber + 1} |`)
        );
      }
    });
  }

  if (warnings.length > 0) {
    console.log('Found warnings:', warnings);
    const warningComment = createWarningComment(warnings);
    console.log(`::set-output name=comment::${warningComment}`);
  }

  return true;
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
