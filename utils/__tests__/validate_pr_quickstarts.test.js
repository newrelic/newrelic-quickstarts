'use strict';

const path = require('path');
const { expect } = require('@jest/globals');

const {
  getQuickstartFromFilename,
  getQuickstartConfigPaths,
  buildMutationVariables,
  buildUniqueQuickstartSet,
  getGraphqlRequests,
} = require('../validate_pr_quickstarts');
const { readQuickstartFile } = require('../helpers');

const mockDashboardRawConfiguration =
  '{"name":".NET","description":".NET","pages":[{"name":".NET App Overview","description":".NET App Overview","widgets":[{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":1,"height":1,"width":12},"title":"","rawConfiguration":{"text":"## More details available on Application Monitoring (APM) page.\\n\\nDive deeper on transaction details, distributed tracing, related entities, anomalies, errors and more. [Open the Explorer.](https://onenr.io/0rVRVGaNWja)"},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":2,"height":3,"width":5},"title":"","rawConfiguration":{"text":"\\n![Transactions](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/dotnet/dotnet/images/Transactions.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":2,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":5,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![Errors](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/dotnet/dotnet/images/Errors.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":5,"height":3,"width":7},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":8,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![VM Metrics](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/dotnet/dotnet/images/VM-metrics.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":8,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null}]},{"name":"Errors","description":"Errors","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":8},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.table"},"layout":{"column":9,"row":1,"height":3,"width":4},"title":"Top 10 Failed Transactions","rawConfiguration":{"dataFormatters":[],"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"Select percentage(count(*), WHERE error IS true) from Transaction WHERE transactionType = \'Web\' facet name SINCE last week"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzODg4NzQ"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":4},"title":"Transactions Errors Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction where response.status = \'404\' and transactionType = \'Web\' TIMESERIES 10 minutes since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":5,"row":4,"height":3,"width":4},"title":"Latest Error","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM TransactionError SELECT latest(timestamp) as \'Latest Error\' SINCE last week "}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.range-chart"},"layout":{"column":9,"row":4,"height":3,"width":4},"title":"Transaction Errors Day By Day","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"FROM TransactionError SELECT count(*), percentage(count(*), WHERE error IS true) FACET dateOf(timestamp) SINCE 1 week ago"}],"other":{"visible":false}},"linkedEntityGuids":null}]},{"name":"VM Metrics","description":"VM Metrics","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"CPU Utilization","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT rate(sum(apm.service.cpu.usertime.utilization), 1 second) * 100 as cpuUsage FROM Metric WHERE appName like \'%\' SINCE 30 minutes ago TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":1,"row":4,"height":3,"width":6},"title":"Memory Heap Used","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) as \'Memory Heap Used\' FROM Metric WHERE appName LIKE \'%\' SINCE 30 MINUTES AGO TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":7,"row":4,"height":3,"width":6},"title":"Average Memory Heap Used Based On Instance","rawConfiguration":{"facet":{"showOtherSeries":false},"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) FROM Metric WHERE appName like \'%\' facet instanceName SINCE today TIMESERIES"}]},"linkedEntityGuids":null}]},{"name":"Transactions","description":"Transactions","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.pie"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"Most Popular Transactions","rawConfiguration":{"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) FROM Transaction WHERE (transactionType = \'Web\') SINCE last week EXTRAPOLATE FACET name"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzNzUyMjY"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":4},"title":"Adpex Score Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT apdex(duration,t: 0.4) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":5,"row":4,"height":3,"width":4},"title":"Throughput Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction TIMESERIES 1 hour  since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":9,"row":4,"height":3,"width":4},"title":"Average Transaction Duration Today Compared With 1 Week Ago","rawConfiguration":{"dataFormatters":[],"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(duration) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.stacked-bar-chart"},"layout":{"column":1,"row":7,"height":4,"width":4},"title":"Top 5 Slowest Transactions","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"SELECT max(duration) FROM Transaction WHERE (transactionType = \'Web\') SINCE 1 week ago LIMIT 5 EXTRAPOLATE FACET name"}],"other":{"visible":false},"yAxis":{"label":"Seconds"}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.range-chart"},"layout":{"column":5,"row":7,"height":4,"width":8},"title":"Transactions Day By Day ","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*), percentage(count(*), WHERE error IS false) FACET dateOf(timestamp) SINCE 1 week ago"}],"other":{"visible":null}},"linkedEntityGuids":null}]}]}';

const buildFullQuickstartFilePaths = (relativePaths) => {
  return relativePaths.map((relativePath) => {
    return path.resolve(process.cwd(), `..${relativePath}`);
  });
};

const mockGitHubResponseFilenames = [
  'quickstarts/test-quickstart-folder/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder/config.yml',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder/icon.jpeg',
  'quickstarts/test-quickstart-folder/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
  'quickstarts/test-quickstart-folder-2/alerts/baseline-alert.yml',
  'quickstarts/test-quickstart-folder-2/alerts/static-alert.yml',
  'quickstarts/test-quickstart-folder-2/config.yml',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.json',
  'quickstarts/test-quickstart-folder-2/dashboards/my-dashboard.png',
  'quickstarts/test-quickstart-folder-2/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/images/icon.jpeg',
  'quickstarts/test-quickstart-folder-2/logo.png',
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

const expectedUniqueQuickstartDirectories = new Set([
  'aiohttp',
  'test-quickstart-folder',
  'test-quickstart-folder-2',
  'pysqlite',
]);

const quickstartNames = [
  'aws-ec2',
  'infrastructure',
  'aiohttp',
  'pysqlite',
  'postgresql',
];

const quickstartConfigRelativePaths = [
  '/quickstarts/aws/aws-ec2/config.yml',
  '/quickstarts/infrastructure/config.yml',
  '/quickstarts/python/aiohttp/config.yml',
  '/quickstarts/python/pysqlite/config.yml',
  '/quickstarts/postgresql/config.yml',
];

const expectedQuickstartConfigFullPaths = buildFullQuickstartFilePaths(
  quickstartConfigRelativePaths
);

const expectedMockQuickstart2MutationInput = {
  dryRun: true,
  id: 'mock-2-id',
  quickstartMetadata: {
    authors: [{ name: 'John Smith' }],
    categoryTerms: ['list', 'of', 'searchable', 'keywords'],
    description:
      'The template quickstart allows you to get visibility into the performance and available of your example service and dependencies. Use this quickstart together with the mock up integrations.',
    displayName: 'Template Quickstart',
    documentation: [
      {
        displayName: 'Installation Docs',
        url: 'docs.newrelic.com',
        description: 'Description about this doc reference',
      },
    ],
    icon: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_quickstarts/mock-quickstart-2/logo.png',
    keywords: ['list', 'of', 'searchable', 'keywords'],
    sourceUrl:
      'https://github.com/newrelic/newrelic-quickstarts/tree/main/utils/mock_quickstarts/mock-quickstart-2',
    summary: 'A short form description for this quickstart',
    installPlanStepIds: ['infra-agent-targeted'],
    alertConditions: [
      {
        description:
          "This alert triggers when the reported health of an Elasticsearch cluster is 'red'.",
        displayName: 'Cluster Health',
        rawConfiguration:
          '{"name":"Cluster Health","details":"This alert triggers when the reported health of an Elasticsearch cluster is \'red\'.\\n","type":"STATIC","nrql":{"query":"FROM ElasticsearchClusterSample SELECT uniqueCount(displayName) WHERE cluster.status = \'red\' FACET displayName"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":0,"thresholdDuration":300,"thresholdOccurrences":"AT_LEAST_ONCE"}],"violationTimeLimitSeconds":86400}',
        type: 'STATIC',
      },
      {
        description:
          'This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.',
        displayName: 'Errors',
        rawConfiguration:
          '{"name":"Errors","details":"This alert fires when 10 percent of the transactions against an application end with an error, over a period of 5 minutes.\\n","type":"STATIC","nrql":{"query":"from Transaction select percentage(count(*), where error is not false) as \'Errors\' where transactionType = \'Web\' facet appName"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":10,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"expiration":{"closeViolationsOnExpiration":true,"openViolationOnExpiration":false,"expirationDuration":86400},"violationTimeLimitSeconds":86400}',
        type: 'STATIC',
      },
    ],
    dashboards: [
      {
        description: '.NET',
        displayName: '.NET',
        rawConfiguration: mockDashboardRawConfiguration,
        screenshots: [
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_quickstarts/mock-quickstart-2/dashboards/dotnet.png',
          },
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_quickstarts/mock-quickstart-2/dashboards/dotnet02.png',
          },
          {
            url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/utils/mock_quickstarts/mock-quickstart-2/dashboards/dotnet03.png',
          },
        ],
      },
    ],
  },
};

const mockGraphqlRequests = [
  {
    filePath:
      '/Users/rtyree/Code/newrelic-quickstarts/quickstarts/python/aiohttp/config.yml',
    variables: {
      dryRun: true,
      id: 'e7948525-8726-46a5-83fa-04732ad42fd1',
      quickstartMetadata: {
        alertConditions: [
          {
            description:
              'This alert is triggered when the Apdex score is below 0.5 for 5 minutes',
            displayName: 'Apdex Score',
            rawConfiguration:
              '{"name":"Apdex Score","details":"This alert is triggered when the Apdex score is below 0.5 for 5 minutes\\n","type":"STATIC","nrql":{"query":"SELECT apdex(apm.service.apdex) as \'Apdex\' FROM Metric WHERE appName like \'%\'"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"BELOW","threshold":0.5,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
          {
            description:
              'This alert is triggered when the CPU Utilization is above 90%.',
            displayName: 'High CPU Utilization',
            rawConfiguration:
              '{"name":"High CPU Utilization","details":"This alert is triggered when the CPU Utilization is above 90%.\\n","type":"STATIC","nrql":{"query":"SELECT rate(sum(apm.service.cpu.usertime.utilization), 1 second) * 100 as cpuUsage FROM Metric WHERE appName like \'%\'"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":90,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
          {
            description:
              'This alert is triggered when the the transactions fail more than 10% of the time in 5 minutes.',
            displayName: 'Transaction Errors',
            rawConfiguration:
              '{"name":"Transaction Errors","details":"This alert is triggered when the the transactions fail more than 10% of the time in 5 minutes.\\n","type":"STATIC","nrql":{"query":"SELECT count(apm.service.error.count) / count(apm.service.transaction.duration) * 100 as \'Web errors\' FROM Metric WHERE appName like \'%\' AND (transactionType = \'Web\')"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":10,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
        ],
        authors: [{ name: 'New Relic' }],
        categoryTerms: ['python', 'apm', 'http'],
        description:
          "## AIO HTTP complete monitoring quickstart\nInstantly monitor Python applications with AIO HTTPS quickstart. Our [Python](https://docs.newrelic.com/docs/agents/python-agent/) integration lets you quickly identify and resolve potential performance issues with your AIO HTTP server and enhance user experiences.\n\n### Monitoring AIO HTTP\n\nPython application developers can extend AIO HTTP performance monitoring to collect, clean, and analyze data to make better data-driven business decisions. Monitoring is vital to ensure uptime and data reliability by keeping an eye on the AIO HTTP server and AIO HTTP client.\n\nNew Relic's AIO HTTP quickstart provides dashboards and built-in instrumentation to track AIO HTTP requests, CPU utilization, garbage collection CPU time, memory heap used, most popular transactions, throughput reports, top 5 slowest transactions, and more. \n\nCount on real-time alerts to apdex scores, CPU utilization, and transaction errors. Expand the Python agent's default monitoring and behavior through the agent API or agent config file and target additional activity and functional calls.\n\n### New Relic - The complte AIO HTTP dashboard tool\n\nThe AIO HTTP dashboard tool ensures total visibility into critical metrics, leveraging dashboards and synthetic checks. With APIs and flexible custom instrumentation options, developers can use multiple building blocks to improve performance and adapt data for your app.\n\n#### What's included?\n\n- Dashboards - CPU Utilization, memory heap used, garbage collection CPU time, top 5 slowest transactions, throughput reports, most popular transactions, and more.\n- Alerts - apdex score, cpu utilization, transaction error.\n\nKnow what's happening in real-time by tracking CPU utilization, throughput reports, and popular transactions with full-stack observability of your entire infrastructure. \n\nWith the AIO HTTP complete monitoring quickstart, you can remediate errors before they impact user experience.",
        displayName: 'AIOHTTP',
        documentation: [
          {
            displayName: 'AIOHTTP installation docs',
            url: 'https://docs.newrelic.com/docs/agents/python-agent/getting-started/compatibility-requirements-python-agent',
            description:
              'Async HTTP framework for Python with support for client and server\nmanagement.\n',
          },
        ],
        icon: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/aiohttp/logo.svg',
        keywords: ['python', 'apm', 'http'],
        sourceUrl:
          'https://github.com/newrelic/newrelic-quickstarts/tree/main/quickstarts/python/aiohttp',
        summary:
          "New Relic's AIO HTTP complete monitoring quickstart offers dashboards, alerts, and custom instrumentation to track the health and performance of your Python application before it impacts user experience.",
        installPlanStepIds: ['setup-python-agent'],
        dashboards: [
          {
            description: 'Python',
            displayName: 'Python',
            rawConfiguration:
              '{"name":"Python","description":"Python","pages":[{"name":"Python App Overview","description":"Python App Overview","widgets":[{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":1,"height":1,"width":12},"title":"","rawConfiguration":{"text":"## More details available on Application Monitoring (APM) page.\\n\\nDive deeper on transaction details, distributed tracing, related entities, anomalies, errors and more. [Open the Explorer.](https://onenr.io/0rVRVGaNWja)"},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":2,"height":3,"width":5},"title":"","rawConfiguration":{"text":"\\n![Transactions](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/Transactions.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":2,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":5,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![Errors](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/Errors.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":5,"height":3,"width":7},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":8,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![VM Metrics](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/VM-metrics.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":8,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null}]},{"name":"Errors","description":"Errors","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":8},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.table"},"layout":{"column":9,"row":1,"height":3,"width":4},"title":"Top 10 Failed Transactions","rawConfiguration":{"dataFormatters":[],"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"Select percentage(count(*), WHERE error IS true) from Transaction WHERE transactionType = \'Web\' facet name SINCE last week"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzODg4NjY"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":6},"title":"Transactions Errors Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction where response.status = \'404\' and transactionType = \'Web\' TIMESERIES 10 minutes since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":7,"row":4,"height":3,"width":6},"title":"Latest Error","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM TransactionError SELECT latest(timestamp) as \'Latest Error\' SINCE last week "}],"thresholds":[]},"linkedEntityGuids":null}]},{"name":"VM Metrics","description":"VM Metrics","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"CPU Utilization","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT rate(sum(apm.service.cpu.usertime.utilization), 1 second) * 100 as cpuUsage FROM Metric WHERE appName like \'%\' SINCE 30 minutes AGO TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":1,"row":4,"height":3,"width":6},"title":"Memory Heap Used","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) as \'Memory Heap Used\' FROM Metric WHERE appName LIKE \'%\' SINCE 30 MINUTES AGO TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":7,"row":4,"height":3,"width":6},"title":"Average Memory Heap Used Based On Instance","rawConfiguration":{"facet":{"showOtherSeries":false},"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) FROM Metric WHERE appName like \'%\' facet instanceName SINCE today TIMESERIES"}]},"linkedEntityGuids":null}]},{"name":"Transactions","description":"Transactions","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.pie"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"Most Popular Transactions","rawConfiguration":{"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) FROM Transaction WHERE (transactionType = \'Web\') SINCE last week EXTRAPOLATE FACET name"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzNzUyMjY"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":4},"title":"Adpex Score Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT apdex(duration,t: 0.4) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":5,"row":4,"height":3,"width":4},"title":"Throughput Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction TIMESERIES 1 hour  since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":9,"row":4,"height":3,"width":4},"title":"Average Transaction Duration Today Compared With 1 Week Ago","rawConfiguration":{"dataFormatters":[],"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(duration) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.stacked-bar-chart"},"layout":{"column":1,"row":7,"height":4,"width":4},"title":"Top 5 Slowest Transactions","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"SELECT max(duration) FROM Transaction WHERE (transactionType = \'Web\') SINCE 1 week ago LIMIT 5 EXTRAPOLATE FACET name"}],"other":{"visible":false},"yAxis":{"label":"MS"}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.range-chart"},"layout":{"column":5,"row":7,"height":4,"width":8},"title":"Transactions Day By Day ","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*), percentage(count(*), WHERE error IS false) FACET dateOf(timestamp) SINCE 1 week ago"}],"other":{"visible":null}},"linkedEntityGuids":null}]}]}',
            screenshots: [
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/aiohttp/dashboards/python.png',
              },
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/aiohttp/dashboards/python02.png',
              },
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/aiohttp/dashboards/python03.png',
              },
            ],
          },
        ],
      },
    },
  },
  {
    filePath:
      '/Users/rtyree/Code/newrelic-quickstarts/quickstarts/python/pysqlite/config.yml',
    variables: {
      dryRun: true,
      id: 'a7dda741-365b-4d47-a1ad-538cff1ea467',
      quickstartMetadata: {
        alertConditions: [
          {
            description:
              'This alert is triggered when the Apdex score is below 0.5 for 5 minutes',
            displayName: 'Apdex Score',
            rawConfiguration:
              '{"name":"Apdex Score","details":"This alert is triggered when the Apdex score is below 0.5 for 5 minutes\\n","type":"STATIC","nrql":{"query":"SELECT apdex(apm.service.apdex) as \'Apdex\' FROM Metric WHERE appName like \'%\'"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"BELOW","threshold":0.5,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
          {
            description:
              'This alert is triggered when the CPU Utilization is above 90%.',
            displayName: 'High CPU Utilization',
            rawConfiguration:
              '{"name":"High CPU Utilization","details":"This alert is triggered when the CPU Utilization is above 90%.\\n","type":"STATIC","nrql":{"query":"SELECT rate(sum(apm.service.cpu.usertime.utilization), 1 second) * 100 as cpuUsage FROM Metric WHERE appName like \'%\'"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":90,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
          {
            description:
              'This alert is triggered when the the transactions fail more than 10% of the time in 5 minutes.',
            displayName: 'Transaction Errors',
            rawConfiguration:
              '{"name":"Transaction Errors","details":"This alert is triggered when the the transactions fail more than 10% of the time in 5 minutes.\\n","type":"STATIC","nrql":{"query":"SELECT count(apm.service.error.count) / count(apm.service.transaction.duration) * 100 as \'Web errors\' FROM Metric WHERE appName like \'%\' AND (transactionType = \'Web\')"},"valueFunction":"SINGLE_VALUE","terms":[{"priority":"CRITICAL","operator":"ABOVE","threshold":10,"thresholdDuration":300,"thresholdOccurrences":"ALL"}],"violationTimeLimitSeconds":86400}',
            type: 'STATIC',
          },
        ],
        authors: [{ name: 'New Relic' }],
        categoryTerms: ['apm', 'python', 'database'],
        description:
          "## What is PySQLite?\n\npysqlite is a Python interface to the SQLite 3.x embedded relational database\nengine.\n\n\n## Get started!\n\nLeverage community expertise and instantly get value out of your telemetry data. This quickstart automatically instruments PySQLite with the New Relic Python agent, and allows you to instantly monitor your Python application with out-of-the-box dashboards and alerts. Further leverage New Relic's APM capabilities by setting up [errors inbox](https://docs.newrelic.com/docs/apm/apm-ui-pages/errors-inbox/errors-inbox/), [transaction tracing](https://docs.newrelic.com/docs/apm/transactions/transaction-traces/introduction-transaction-traces/), and [service maps](https://docs.newrelic.com/docs/understand-dependencies/understand-system-dependencies/service-maps/introduction-service-maps/).\n\n## More info\n\nCheck out the [documentation](https://docs.newrelic.com/docs/agents/python-agent/) to learn more about New Relic monitoring for PySQLite.",
        displayName: 'PySQLite',
        documentation: [
          {
            displayName: 'PySQLite installation docs',
            url: 'https://docs.newrelic.com/docs/agents/python-agent/getting-started/instrumented-python-packages',
            description:
              'pysqlite is a Python interface to the SQLite 3.x embedded relational\ndatabase engine.\n',
          },
        ],
        icon: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/pysqlite/logo.svg',
        keywords: ['apm', 'python', 'database'],
        sourceUrl:
          'https://github.com/newrelic/newrelic-quickstarts/tree/main/quickstarts/python/pysqlite',
        summary: "Monitor PySQLite with New Relic's Python agent",
        installPlanStepIds: ['setup-python-agent'],
        dashboards: [
          {
            description: 'Python',
            displayName: 'Python',
            rawConfiguration:
              '{"name":"Python","description":"Python","pages":[{"name":"Python App Overview","description":"Python App Overview","widgets":[{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":1,"height":1,"width":12},"title":"","rawConfiguration":{"text":"## More details available on Application Monitoring (APM) page.\\n\\nDive deeper on transaction details, distributed tracing, related entities, anomalies, errors and more. [Open the Explorer.](https://onenr.io/0rVRVGaNWja)"},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":2,"height":3,"width":5},"title":"","rawConfiguration":{"text":"\\n![Transactions](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/Transactions.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":2,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":5,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![Errors](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/Errors.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":5,"height":3,"width":7},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.markdown"},"layout":{"column":1,"row":8,"height":3,"width":5},"title":"","rawConfiguration":{"text":"![VM Metrics](https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/python/images/VM-metrics.png)\\n"},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":6,"row":8,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null}]},{"name":"Errors","description":"Errors","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":8},"title":"Errors Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\',percentage(count(*), WHERE error IS true) as \'Failed transactions (%)\', count(*) * percentage(count(*), WHERE error IS true) / 100 as \'Failed transactions\' SINCE 1 week ago"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.table"},"layout":{"column":9,"row":1,"height":3,"width":4},"title":"Top 10 Failed Transactions","rawConfiguration":{"dataFormatters":[],"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"Select percentage(count(*), WHERE error IS true) from Transaction WHERE transactionType = \'Web\' facet name SINCE last week"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzODg4NjY"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":6},"title":"Transactions Errors Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction where response.status = \'404\' and transactionType = \'Web\' TIMESERIES 10 minutes since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.billboard"},"layout":{"column":7,"row":4,"height":3,"width":6},"title":"Latest Error","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM TransactionError SELECT latest(timestamp) as \'Latest Error\' SINCE last week "}],"thresholds":[]},"linkedEntityGuids":null}]},{"name":"VM Metrics","description":"VM Metrics","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"VM Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Metric SELECT average(apm.service.cpu.usertime.utilization) * 100 as \'Average CPU utilization (%)\', average(apm.service.memory.physical) as \'Average memory used (MB)\' WHERE appName like \'%\' SINCE 1 week AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"CPU Utilization","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT rate(sum(apm.service.cpu.usertime.utilization), 1 second) * 100 as cpuUsage FROM Metric WHERE appName like \'%\' SINCE 30 minutes AGO TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":1,"row":4,"height":3,"width":6},"title":"Memory Heap Used","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) as \'Memory Heap Used\' FROM Metric WHERE appName LIKE \'%\' SINCE 30 MINUTES AGO TIMESERIES"}]},"linkedEntityGuids":null},{"visualization":{"id":"viz.area"},"layout":{"column":7,"row":4,"height":3,"width":6},"title":"Average Memory Heap Used Based On Instance","rawConfiguration":{"facet":{"showOtherSeries":false},"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(`apm.service.memory.heap.used`) FROM Metric WHERE appName like \'%\' facet instanceName SINCE today TIMESERIES"}]},"linkedEntityGuids":null}]},{"name":"Transactions","description":"Transactions","widgets":[{"visualization":{"id":"viz.billboard"},"layout":{"column":1,"row":1,"height":3,"width":7},"title":"Transactions Overview","rawConfiguration":{"dataFormatters":[],"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*) as \'Total transactions\', average(duration) as \'Avg duration (s)\', percentile(duration, 90) as \'Slowest 10% (s)\', percentage(count(*), WHERE error is false) AS \'Success rate\' SINCE 1 WEEK AGO"}],"thresholds":[]},"linkedEntityGuids":null},{"visualization":{"id":"viz.pie"},"layout":{"column":8,"row":1,"height":3,"width":5},"title":"Most Popular Transactions","rawConfiguration":{"facet":{"showOtherSeries":false},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) FROM Transaction WHERE (transactionType = \'Web\') SINCE last week EXTRAPOLATE FACET name"}]},"linkedEntityGuids":["MjU5NDA4MnxWSVp8REFTSEJPQVJEfDIzNzUyMjY"]},{"visualization":{"id":"viz.line"},"layout":{"column":1,"row":4,"height":3,"width":4},"title":"Adpex Score Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT apdex(duration,t: 0.4) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":5,"row":4,"height":3,"width":4},"title":"Throughput Today Compared With 1 Week Ago","rawConfiguration":{"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT count(*) from Transaction TIMESERIES 1 hour  since today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"viz.line"},"layout":{"column":9,"row":4,"height":3,"width":4},"title":"Average Transaction Duration Today Compared With 1 Week Ago","rawConfiguration":{"dataFormatters":[],"legend":{"enabled":true},"nrqlQueries":[{"accountId":0,"query":"SELECT average(duration) FROM Transaction TIMESERIES SINCE today COMPARE WITH 1 week ago"}],"yAxisLeft":{"zero":true}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.stacked-bar-chart"},"layout":{"column":1,"row":7,"height":4,"width":4},"title":"Top 5 Slowest Transactions","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"SELECT max(duration) FROM Transaction WHERE (transactionType = \'Web\') SINCE 1 week ago LIMIT 5 EXTRAPOLATE FACET name"}],"other":{"visible":false},"yAxis":{"label":"MS"}},"linkedEntityGuids":null},{"visualization":{"id":"dc5b694f-9125-4c64-8e4e-c52e604c8088.range-chart"},"layout":{"column":5,"row":7,"height":4,"width":8},"title":"Transactions Day By Day ","rawConfiguration":{"nrqlQueries":[{"accountId":0,"query":"FROM Transaction SELECT count(*), percentage(count(*), WHERE error IS false) FACET dateOf(timestamp) SINCE 1 week ago"}],"other":{"visible":null}},"linkedEntityGuids":null}]}]}',
            screenshots: [
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/pysqlite/dashboards/python.png',
              },
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/pysqlite/dashboards/python02.png',
              },
              {
                url: 'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main/quickstarts/python/pysqlite/dashboards/python03.png',
              },
            ],
          },
        ],
      },
    },
  },
];

describe('getQuickstartFromFilename', () => {
  test('returns the quickstart an alert belongs to', () => {
    const quickstartFromAlert = getQuickstartFromFilename(
      'quickstarts/python/aiohttp/alerts/ApdexScore.yml'
    );

    expect(quickstartFromAlert).toEqual('aiohttp');
  });

  test('returns the quickstart a dashboard belongs to', () => {
    const quickstartFromDashboard = getQuickstartFromFilename(
      'quickstarts/python/pysqlite/dashboards/python.json'
    );

    expect(quickstartFromDashboard).toEqual('pysqlite');
  });

  test('returns the quickstart a logo belongs to', () => {
    const quickstartFromLogo = getQuickstartFromFilename(
      'quickstarts/python/pysqlite/logo.svg'
    );

    expect(quickstartFromLogo).toEqual('pysqlite');
  });
});

describe('Utility functions', () => {
  test('buildUniqueQuickstartSet returns a list of unique quickstarts', () => {
    const uniqueQuickstarts = mockGitHubResponseFilenames
      .map(addFilenameObject)
      .reduce(buildUniqueQuickstartSet, new Set());

    expect(uniqueQuickstarts).toEqual(expectedUniqueQuickstartDirectories);
  });

  test('getQuickstartConfigPaths returns list of unique quickstart config filepaths', () => {
    const configPaths = getQuickstartConfigPaths(quickstartNames);

    expect(configPaths).toEqual(expectedQuickstartConfigFullPaths);
  });

  test('buildMutationVariables returns expected mutation input from quickstart config', () => {
    const mutationInput = buildMutationVariables(
      readQuickstartFile(
        `${process.cwd()}/mock_quickstarts/mock-quickstart-2/config.yml`
      )
    );

    expect(mutationInput).toEqual(expectedMockQuickstart2MutationInput);
  });

  test('getGraphqlRequests constructs requests with a filepath and variables structure', () => {
    const graphqlRequests = getGraphqlRequests(
      mockGitHubResponseFilenames.map(addFilenameObject)
    );

    expect(graphqlRequests).toEqual(mockGraphqlRequests);
  });
});
