[![Community Project header](https://github.com/newrelic/opensource-website/raw/master/src/images/categories/Community_Project.png)](https://opensource.newrelic.com/oss-category/#community-project)

This is an overview of the directories used to create a Quickstart, the directories within this \_template folder mirror the directories in the top level of the repository. The structure of new contributions should match the structure seen here. You can find examples of expected files and their structure within each folder.

_(2022-06-07)_ **NOTE:** We recently updated the structure of quickstarts. Below is an explanation of the new directory structure.

## Example directory structure

```
quickstarts/
    example-quickstart/
        config.yml
        logo.svg
alert-policies/
    example-alert-policy/
      condition-a.yml
      condition-b.yml
dashboards/
    example-dashboard/
        config.json
        screenshot-a.png
        screenshot-b.png
data-sources/
    example-data-source/
        config.yml
        logo.svg
```

Dashboards and alerts no longer live within the quickstart, but a directory on the same level named dashboards and alert-policies, respectively. The quickstarts config.yml should now refer to associated dashboards and alerts. See this templates [config.yml](./quickstarts/example-quickstart/config.yml) as an example.

## Support

New Relic hosts and moderates an online forum where customers can interact with New Relic employees as well as other customers to get help and share best practices. Like all official New Relic open source projects, there's a related Community topic in the New Relic Explorers Hub. You can find this project's topic/threads here:

- [Explorers Hub](https://discuss.newrelic.com/t/new-relic-one-quickstarts/161980)
