# Observability Pack Alert Configuration

**Title:** Observability Pack Alert Configuration

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** Alert configuration schema for Observability Packs

| Property         | Pattern | Type             | Deprecated | Definition | Title/Description      |
| ---------------- | ------- | ---------------- | ---------- | ---------- | ---------------------- |
| + [name](#name ) | No      | string           | No         | -          | The name of the Alert. |
| + [type](#type ) | No      | enum (of string) | No         | -          | The type of Alert.     |
| + [nrql](#nrql ) | No      | object           | No         | -          | -                      |
|                  |         |                  |            |            |                        |

## <a name="name"></a>1. [Required] Property `Observability Pack Alert Configuration > name`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The name of the Alert.

## <a name="type"></a>2. [Required] Property `Observability Pack Alert Configuration > type`

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

**Description:** The type of Alert.

Must be one of:
* "STATIC"
* "BASELINE"
* "OUTLIER"

## <a name="nrql"></a>3. [Required] Property `Observability Pack Alert Configuration > nrql`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Property                | Pattern | Type   | Deprecated | Definition | Title/Description |
| ----------------------- | ------- | ------ | ---------- | ---------- | ----------------- |
| + [query](#nrql_query ) | No      | string | No         | -          | -                 |
|                         |         |        |            |            |                   |

### <a name="nrql_query"></a>3.1. [Required] Property `Observability Pack Alert Configuration > nrql > query`

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2021-09-23 at 16:52:01 +0000