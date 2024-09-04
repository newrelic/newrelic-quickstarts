# Documentation

Each file in this directory (minus this readme) is generated from New Relic NerdGraph GraphQL schema.

## Validation

Every quickstart, datasource, alert, and dashboard is bundled into a single artifact and validated against our [schema](../utils/schema/artifact.json) for correctness.

> [!IMPORTANT]
> Please ensure that _all_ feature flags are removed from a datasource before it is referenced in a quickstart. Otherwise, the datasource will not be properly associated.
