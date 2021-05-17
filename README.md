[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

# New Relic Observability Packs

The New Relic Observability Pack provides a jump start to getting value from New Relic, for the specific use case an engineer cares about. It includes clear steps for setting up instrumentation, as well as the basic observability building blocks like dashboards & alerts. All of this is available through an open ecosystem where relics, partners and customers contribute their best-practice solutions.

## Getting Started

Do you have some great dashboards to share? Follow the steps below to add them to the library.

1. [Fork the Github repository](https://help.github.com/en/github/getting-started-with-github/fork-a-repo#fork-an-example-repository)

2. [Clone your own repository to your local machine](https://help.github.com/en/github/creating-cloning-and-archiving-repositories/cloning-a-repository)

3. Copy the `_template` directory and its content to a new directory within the root folder. Choose a name which identifies the purpose of your pack, such as `rabbitmq`, `apm-errors`, `sre`, or `aws-s3`

4. In your new directory, you'll find the following folders: `dashboards`, `alerts`, `flex`, and `synthetics`. Each folder contains a template that you can use to create entities for your Observability pack.

To add a dashboard to your pack  export your dashboard using the `Copy JSON to clipboard` functionality in the dashboard UI and save it as a file `[name].json` in the `dashboards` directory. You can use any name to replace `[name`] and you can also add multiple json files. Next create a screenshot of your dashboard and add it to `dashboards` directory, and give it the same name as your dashboard json file.

> **Note:** You can add multiple JSON files and screenshots to `dashboards`. Pair each screenshot with a JSON file by using the same file name. If you want multiple screenshots for a dashboard, add a number at the end of the file name. So, your `dashboards` folder might contain:

- `rabbitmq.json` 
- `rabbitmq.png` or `rabbitmq.jpeg`
- `rabbitmq01.png`
- `rabbitmq02.png` 

Finally, rename the `config.yaml` file to the same name as the JSON file, and update its contents. This is where you provide a clear name and description for your dashboard.

This process is similar for all other entity directories. Also, if you don't want to create entities for a given type, you can simply delete the corresponding directory.

5. In your pack's root directory, you'll find a `config.yaml` file. Set the name of your pack. Everything else is optional.

6. Now let's commit your changes `git add -A` and `git commit -m "Added [name]"`. Change the `[name]` with a description of the dashboard you've added.

7. Push your changes to Github: 

```sh
git push
```

8. [Create a pull request](https://help.github.com/en/github/collaborating-with-issues-and-pull-requests/creating-a-pull-request) in the [parent repository](https://github.com/newrelic/newrelic-observability-packs/compare?expand=1).

9. Submit and wait for review. We will review as fast as we can, but it can sometimes take a day or two.

Thanks a lot for your submission!

## Usage
>[**Optional** - Include more thorough instructions on how to use the software. This section might not be needed if the Getting Started section is enough. Remove this section if it's not needed.]


## Building

>[**Optional** - Include this section if users will need to follow specific instructions to build the software from source. Be sure to include any third party build dependencies that need to be installed separately. Remove this section if it's not needed.]

## Testing

>[**Optional** - Include instructions on how to run tests if we include tests with the codebase. Remove this section if it's not needed.]

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

>Add the url for the support thread here: discuss.newrelic.com

## Contribute

We encourage your contributions to improve New Relic Observability packs! Keep in mind that when you submit your pull request, you'll need to sign the CLA via the click-through using CLA-Assistant. You only have to sign the CLA one time per project.

If you have any questions, or to execute our corporate CLA (which is required if your contribution is on behalf of a company), drop us an email at opensource@newrelic.com.

**A note about vulnerabilities**

As noted in our [security policy](../../security/policy), New Relic is committed to the privacy and security of our customers and their data. We believe that providing coordinated disclosure by security researchers and engaging with the security community are important means to achieve our security goals.

If you believe you have found a security vulnerability in this project or any of New Relic's products or websites, we welcome and greatly appreciate you reporting it to New Relic through [HackerOne](https://hackerone.com/newrelic).

If you would like to contribute to this project, review [these guidelines](./CONTRIBUTING.md).

To all contributors, we thank you!  Without your contribution, this project would not be what it is today.  We also host a community project page dedicated to New Relic Observability packs(<LINK TO https://opensource.newrelic.com/projects/... PAGE>).

## License
New Relic Observability packs is licensed under the [Apache 2.0](http://apache.org/licenses/LICENSE-2.0.txt) License.
>[If applicable: The New Relic Observability packs also uses source code from third-party libraries. You can find full details on which libraries are used and the terms under which they are licensed in the third-party notices document.]
