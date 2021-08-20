# Alert Config File Schema

An alert config is written in YAML and adheres to the specifications outlined below.

## Filename format

Alert config files are placed under `packs/<pack_name>/alerts/`. There are 3 types of alerts we can configure:

```bash
packs/<pack_name>/alerts/baseline-alert.yml
packs/<pack_name>/alerts/outlier-alert.yml
packs/<pack_name>/alerts/static-alert.yml
```

## Schema definition

```yaml
####################################################################################
# Metadata - these fields will be removed from the AlertsNrqlConditionInput
####################################################################################

# the name of the Alert
name: string, required

# A short description for this Alert condition
details: string, optional

# Type of Alert condition
type: enum, required # One of [ BASELINE, OUTLIER, STATIC ]

# Url of the Alert JSON definition
url: string, required

####################################################################################
# Alert Condition Definition - not validating this, as the type is not controlled
# by us and can change
####################################################################################

```

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).
