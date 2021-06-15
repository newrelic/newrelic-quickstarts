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

# Unique name for observability pack
# Example: Apache
name: string, required

# A short form description for this Observability Pack. Used throughout the platform when displaying the pack.
details: string, required

type: enum, required # One of [ BASELINE, OUTLIER, STATIC ]

nrql: object, required
  query: string, required

terms: list(object), optional
  - priority: enum, required
    threshold: int, required
    thresholdDuration: int, required
    threadholdOccurrences: string, required

expiration: object, required
  closeViolationsONExpiration: boolean, required
  openViolationOnExpiration: boolean, required
  expirationDuration: int, optional

signal: object, required
  evaluationOffset: int, required
  fillOption: enum, required
  fillValue: int, optional

# OPTIONAL: URL of runbook to be sent with notification
runbookURL: string, optional

# OPTIONAL: Custom violation description sent with JSON payload
description: string, optional

# Duration after which a violation automatically closes
# Time in seconds; 300 - 2592000 (Default: 86400 [1 day])
violationTimeLimitSeconds: int, required
```

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).
