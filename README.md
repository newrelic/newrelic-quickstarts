[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

**NOTE:** We recently changed this repository from `newrelic-observability-packs` to `newrelic-quickstarts` to better align with the project goals. If any of your services are reliant on this repo they will need to be checked and altered.

# New Relic One quickstarts

> Only users with full platform access can use the dashboards installed with a quickstart.

New Relic One quickstarts help accelerate your New Relic journey by providing immediate value for your specific use cases. They include:

- Clear instructions for instrumenting your services
- Observability building blocks like dashboards and alerts

All of this is available through our [Instant Observability](https://developer.newrelic.com/instant-observability) open source ecosystem where New Relic developers, partners, and customers contribute their best-practice solutions.

## New Relic One Instant Observability

> Looking for inspiration?

You can search for all the available quickstarts in the [New Relic Instant Observability catalog](https://developer.newrelic.com/instant-observability).

## Quickstart components

### 📊 Dashboards

With [New Relic One dashboards](https://docs.newrelic.com/docs/query-your-data/explore-query-data/dashboards/introduction-dashboards/) you can customize and understand the data you collect. Explore your data and correlate connected sources with tailored, user-friendly charts, and quickly learn the state of your system and applications for faster, more efficient troubleshooting.

1. Ensure you're using Node.js version 16, [nvm](https://github.com/nvm-sh/nvm/blob/master/README.md) is a great tool to help you get the right Node.js versions.
2. run `yarn install`, if you do not have [yarn](https://www.npmjs.com/package/yarn), this link will help!
3. Refer to our [contributor guide](https://github.com/newrelic/newrelic-quickstarts/blob/main/CONTRIBUTING.md#dashboard-json) on working with dashboard JSON.

### 📟 Alerts

[Alerts](https://docs.newrelic.com/docs/alerts-applied-intelligence/new-relic-alerts/learn-alerts/introduction-alerts/) lets you set up robust and customizable alert policies for anything that you can monitor. Receive notifications for fluctuations in key performance metrics as data streams in from all of our products, including APM, infrastructure, browser, mobile, and NRQL queries.

### 💽 Data Sources

[Data Sources](https://developer.newrelic.com/collect-data/collect-data-from-any-source/) are the many sources of data you can setup with New Relic to collect and monitor data.

### 🔮 Future

Our road map for quickstarts includes the addition of [Synthetics monitoring](https://docs.newrelic.com/docs/synthetics/synthetic-monitoring/getting-started/get-started-synthetic-monitoring/), [NerdPacks](https://developer.newrelic.com/build-apps/) and [Flex configurations](https://docs.newrelic.com/docs/integrations/host-integrations/host-integrations-list/flex-integration-tool-build-your-own-integration/).

## Getting Started

> Review our comprehensive [Developer Guide](https://developer.newrelic.com/contribute-to-quickstarts/) to get starting building your quickstart!

Contribute your own quickstart to the New Relic One catalog by following the steps below:

1. [Fork the Github repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository)

2. [Clone your own repository to your local machine](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

3. Copy the `_template` directory and its content to a new directory within the `quickstarts` folder. Choose a name which identifies the purpose of your quickstart, such as `rabbitmq`, `apm-errors`, `sre`, or `aws-s3`

4. In your new directory, you'll find the following folders: `dashboards`, `alerts` and `images`. Each folder contains a template or template directories that you can use to create entities for your quickstart.

- For example, to add an existing dashboard to your quickstart, [copy the dashboard's JSON](https://docs.newrelic.com/docs/query-your-data/explore-query-data/dashboards/manage-your-dashboard/#dash-json), and save it as a JSON file in the `dashboards` directory. Next, create a screenshot of your dashboard, add it to `dashboards`, and give it the same name as your JSON file.

- You can add multiple JSON files and screenshots to `dashboards`. Pair each screenshot with a JSON file by using the same file name. If you want multiple screenshots for a dashboard, add a number at the end of the file name. So, your `dashboards` folder might contain:

      - `rabbitmq.json`
      - `rabbitmq.png` or `rabbitmq.jpeg`
      - `rabbitmq01.png`
      - `rabbitmq02.png`

- The `images` folder should contain images you want to display within a markdown widget on your Dashboard. An example of this would be the [Python quickstart](https://github.com/newrelic/newrelic-quickstarts/blob/main/quickstarts/python/python/dashboards/python.png) which includes image widgets defined using markdown. For more information on this see our docs on [creating widgets containing markdown text](https://docs.newrelic.com/docs/query-your-data/explore-query-data/dashboards/manage-your-dashboard/#markdown)

- When adding alerts to your quickstart, [using NerdGraph](https://developer.newrelic.com/contribute-to-quickstarts/query-alerts-for-quickstart/) can assist you with adding existing alert configurtions to your yaml files.

- This process is similar for all other entity directories. Also, if you don't want to create entities for a given type, delete the corresponding directory.

5. In your quickstart's root directory, you'll find a `config.yml` file where you can configure your quickstart. Refer to our [Contributing Guide](./CONTRIBUTING.md) for more details on quickstart configurations.

6. Commit your changes using the [Conventional Commit syntax](./CONTRIBUTING.md#using-conventional-commits):

   ```sh
   git add -A
   git commit -m "feat([name]): Added [name]"
   ```

7. Push your changes to Github:

   ```sh
   git push
   ```

8. [Create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) in the [parent repository](https://github.com/newrelic/newrelic-quickstarts/compare?expand=1).

9. Submit and wait for review. Please be available to resolve review feedback in a timely manner.

**NOTE:** All contributions are public and available for use by others. When contributing, make sure the NRQL queries you use match the datasets the users have. You don't want to use NRQL queries with sensitive data.

## Testing

### Importer

> WARNING: The importer is for testing only and might change or be removed in the future. You can still use it today for testing, but it is not meant to be used in a production environment.

We've included an `importer` utility for testing quickstarts on your account. You can run this using the included [import.sh](./import.sh) script.

> Note: The importer spins up a docker container, so you must have docker installed and running for this to function

1. Modify [importer-config.sh](./importer-config.sh) with your account number and New Relic API Key
2. Run [import.sh](./import.sh) from the root of this project:

   ```bash
   # Usage:
   ./import.sh $QUICKSTART_NAME

   # Example
   > ./import.sh mysql
   ```

   If your quickstart is in a sub-directory please include that too for example `python/flask`

```
 # Example
 > ./import.sh python/flask
```

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

- [Explorers Hub](https://discuss.newrelic.com/t/new-relic-one-quickstarts/161980)

## Contribute

If you would like to contribute to this project, review [these guidelines](./CONTRIBUTING.md).

We encourage your contributions to improve New Relic One quickstarts! Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA (which is required if your contribution is on behalf of a company), drop us an email at opensource@newrelic.com.

## A note about vulnerabilities

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

## License

New Relic One quickstarts is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
