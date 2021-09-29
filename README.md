[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)


# New Relic One Observability Packs

> 🧪 This project is currently in an `ALPHA` state 🧪

New Relic One observability packs jump start your New Relic journey by providing immediate value for your specific use cases. They include:

- Clear steps for instrumenting your services
- Observability building blocks like dashboards and alerts

All of this is available through an open ecosystem where New Relic developers, partners, and customers contribute their best-practice solutions.

## Getting Started

Contribute your own observability pack to the New Relic One catalog by following the steps below:

1. [Fork the Github repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository)

2. [Clone your own repository to your local machine](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

3. Copy the `_template` directory and its content to a new directory within the `packs` folder. Choose a name which identifies the purpose of your pack, such as `rabbitmq`, `apm-errors`, `sre`, or `aws-s3`

4. In your new directory, you'll find the following folders: `dashboards`, `alerts`, `instrumentation`. Each folder contains a template or template directories that you can use to create entities for your observability pack.

    For example, to add an existing dashboard to your new observability pack, [copy the dashboard's JSON](https://docs.newrelic.com/docs/query-your-data/explore-query-data/dashboards/manage-your-dashboard/#dash-json), and save it as a JSON file in the `dashboards` directory. Next, create a screenshot of your dashboard, add it to `dashboards`, and give it the same name as your JSON file.

    > **Note:** You can add multiple JSON files and screenshots to `dashboards`. Pair each screenshot with a JSON file by using the same file name. If you want multiple screenshots for a dashboard, add a number at the end of the file name. So, your `dashboards` folder might contain:

      - `rabbitmq.json`
      - `rabbitmq.png` or `rabbitmq.jpeg`
      - `rabbitmq01.png`
      - `rabbitmq02.png`

    This process is similar for all other entity directories. Also, if you don't want to create entities for a given type, delete the corresponding directory.

    > **Note:**  When adding alerts to your quickstart, [using NerdGraph](#using-nerdGraph-for-existing-alerts) can assist you with adding existing alert configurtions to your yaml files.

5. In your pack's root directory, you'll find a `config.yaml` file. Set the name of your pack. Everything else is optional.

6. Commit your changes using the [Conventional Commit syntax](./CONTRIBUTING.md#using-conventional-commits):

    ```sh
    git add -A
    git commit -m "feat([name]): Added [name]"
    ```

    Change the `[name]` and add a description of the dashboard you've added.

7. Push your changes to Github:

    ```sh
    git push
    ```

8. [Create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) in the [parent repository](https://github.com/newrelic/newrelic-observability-packs/compare?expand=1).

9. Submit and wait for review. We will review as fast as we can, but it can sometimes take a day or two.

Thanks a lot for your submission!

## Using NerdGraph for existing alerts

When adding alerts to your quickstart, if you want to start from an existing alert, you can use our [GraphQL API](https://api.newrelic.com/graphiql) to get a json object that can help you populate your `alerts.yaml` file.

For example, the following NerdGraph query returns a json object that you can use to populate the `alerts.yaml` file:

```
{
    actor {
        account(id: REPLACE_ACCOUNT_ID) {
            alerts {
                nrqlCondition(id: REPLACE_CONDITION_ID) {
                    ... on AlertsNrqlBaselineCondition {
                    id
                    name
                    nrql {
                        query
                    }
                    }
                }
            }
        }
    }
}
```

After running the query, you will see a response similar to the one below with the details of your alert condition that you can use to update your quickstarts alerts configurations:

```
{
"data": {
    "actor": {
    "account": {
        "alerts": {
        "nrqlCondition": {
            "id": "123456",
            "name": "Login 95th Percentile baseline",
            "nrql": {
            "query": "SELECT percentile(duration, 95) from Transaction where appName = 'WebPortal' and name = 'WebTransaction/JSP/login.jsp'"
            }
        }
        }
    }
    }
}
```

## Testing

### Importer

> WARNING: The importer is for testing only and might change or be removed in the future. You can still use it today for testing, but it is not meant to be used in a production environment.

We've included an `importer` utility for testing packs on your account. You can run this using the included [import.sh](./import.sh) script.

> Note: The importer spins up a docker container, so you must have docker installed and running for this to function

1. Modify [importer-config.sh](./importer-config.sh) with your account number and New Relic API Key
2. Run [import.sh](./import.sh) from the root of this project:

   ```bash
   # Usage:
   ./import.sh $PACK_NAME

   # Example
   > ./import.sh mysql
   ```

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

>Add the url for the support thread here: discuss.newrelic.com

## Contribute

We encourage your contributions to improve New Relic One observability packs! Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA (which is required if your contribution is on behalf of a company), drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

If you would like to contribute to this project, review [these guidelines](./CONTRIBUTING.md).

To all contributors, we thank you!  Without your contribution, this project would not be what it is today.  We also host a community project page dedicated to New Relic One observability packs(<LINK TO https://opensource.newrelic.com/projects/... PAGE>).

## License

New Relic One observability packs is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
