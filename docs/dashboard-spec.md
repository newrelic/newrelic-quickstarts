# Dashboard Config File Schema

A dashboard config is written in JSON and adheres to the specifications outlined below.

## Filename format

Dashboard config files are placed under `packs/<pack_name>/dashboards/`. Example:

```bash
packs/<pack_name>/dashboards/apache.json
```

## Schema definition

The schema adheres to the `DashboardInput` used in the [dashboardCreate](https://docs.newrelic.com/docs/new-relic-one/use-new-relic-one/core-concepts/dashboards-api-migration-insights-api-nerdgraph/#dashboard-create) mutation in NerdGraph.

```yaml
####################################################################################
# Metadata
####################################################################################

# the name of the Dashboard
name: string, required

# A short description for this Dashboard
description: string, required

####################################################################################
# Alert Condition Definition - not validating this, as the type is not controlled
# by us and can change
####################################################################################

```

There are two other requirements:

* The top level `description` cannot be null
* The `permissions` field should be null, and will be set to `PUBLIC_READ_WRITE` for all dashboards created through the Observability Pack flow.

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).

