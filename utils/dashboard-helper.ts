// At this point we are on the PR's ref, so we can operate on all dashboards

const guidRegex = /guid[`'"\) ]/;
const entityGuidRegex = /entityGuid/;
const guidFieldRegex = /\"linkedEntityGuids\": (?:(?!null))/;
const permissionsFieldRegex = /\"permissions\": /;
const accountIdRegEx = /\"accountId\": (?:(?!0))/;

import Dashboard from './lib/Dashboard';

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
  const commentMessage = [`### The PR checks have run and found the following warnings:${encodedNewline}`,];
  const tableHeader = `| Warning | Filepath | Line # | ${encodedNewline}| --- | --- | --- | `;
  commentMessage.push(tableHeader);
  warnings.forEach(w => commentMessage.push(w));
  return commentMessage.join(encodedNewline);
};

const main = () => {
  const dashboards = Dashboard.getAll();
  const warnings: string[] = [];

  for (const dash of dashboards) {
    const dashLines = JSON.stringify(dash.config, null, 2).split('\n');

    dashLines.forEach((line, lineNumber) => {
      const output = checkLine(line);
      if (output.length > 0) {
        output.forEach(o => warnings.push(`| ${o} | ${dash.configPath} | ${lineNumber + 1} |`));
      }
    });
  };

  if (warnings.length > 0) {
    console.log("Found warnings:", warnings);
    const warningComment = createWarningComment(warnings);
    console.log(`::set-output name=comment::${warningComment}`);
  }
};

main();
