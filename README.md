[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

**Announcement**: (07/28/2022) We recently made updates to the directory structure. Dashboards and alerts are now stored in their own directories, `dashboards/` and `alert-policies` respectively. For more information on the new structure, see our [contributing guide](./CONTRIBUTING.md)

# New Relic One quickstarts

> Only users with full platform access can use the dashboards installed with a quickstart.

New Relic One quickstarts help accelerate your New Relic journey by providing immediate value for your specific use cases. They include:

- Clear instructions for instrumenting your services
- Observability building blocks like dashboards and alerts

All of this is available through our [Instant Observability](https://developer.newrelic.com/instant-observability) open source ecosystem where New Relic developers, partners, and customers contribute their best-practice solutions.

## New Relic One Instant Observability

> Looking for inspiration?

You can search for all the available quickstarts in the [New Relic Instant Observability catalog](https://developer.newrelic.com/instant-observability).

## Getting Started

> Review our comprehensive [Developer Guide](https://developer.newrelic.com/contribute-to-quickstarts/) to get starting building your quickstart!

Head over to our [contributing guide](./CONTRIBUTING.md) to learn how to define your own quickstart! 

## Testing

### Importer (Deprecated)

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
