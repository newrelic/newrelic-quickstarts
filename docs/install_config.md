# The root schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** The root schema comprises the entire JSON document.

| Property                       | Pattern | Type   | Deprecated | Definition | Title/Description      |
| ------------------------------ | ------- | ------ | ---------- | ---------- | ---------------------- |
| + [id](#id )                   | No      | string | No         | -          | The id schema          |
| - [title](#title )             | No      | string | No         | -          | The title schema       |
| - [description](#description ) | No      | string | No         | -          | The description schema |
| + [target](#target )           | No      | object | No         | -          | The target schema      |
| + [install](#install )         | No      | object | No         | -          | The install schema     |
| - [fallback](#fallback )       | No      | object | No         | -          | The fallback schema    |
|                                |         |        |            |            |                        |

**Example:** 

```json
{
    "id": "infra-agent-standard",
    "title": "Infrastructure Agent Install",
    "description": "New Relic's infrastructure monitoring agent is a lightweight executable file that collects data about your hosts. It also forwards data from infrastructure integrations to New Relic, as well as log data for log analytics.",
    "target": {
        "type": "agent",
        "destination": "host",
        "os": [
            "darwin",
            "linux",
            "windows"
        ],
        "context": "markdown content"
    },
    "install": {
        "mode": "targetedInstall",
        "destination": {
            "recipeName": "infrastructure-agent-installer",
            "nerdletId": "setup-nerdlets.setup-python-integration",
            "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
        }
    },
    "fallback": {
        "mode": "targetedInstall",
        "destination": {
            "recipeName": "infrastructure-agent-installer",
            "nerdletId": "setup-nerdlets.setup-python-integration",
            "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
        }
    }
}
```

## <a name="id"></a>1. [Required] Property `root > id`

**Title:** The id schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"infra-agent-standard"
```

## <a name="title"></a>2. [Optional] Property `root > title`

**Title:** The title schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"Infrastructure Agent Install"
```

## <a name="description"></a>3. [Optional] Property `root > description`

**Title:** The description schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"New Relic's infrastructure monitoring agent is a lightweight executable file that collects data about your hosts. It also forwards data from infrastructure integrations to New Relic, as well as log data for log analytics."
```

## <a name="target"></a>4. [Required] Property `root > target`

**Title:** The target schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                              | Pattern | Type             | Deprecated | Definition | Title/Description      |
| ------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------- |
| + [type](#target_type )               | No      | enum (of string) | No         | -          | The type schema        |
| + [destination](#target_destination ) | No      | enum (of string) | No         | -          | The destination schema |
| - [os](#target_os )                   | No      | array            | No         | -          | The os schema          |
| - [context](#target_context )         | No      | string           | No         | -          | The context schema     |
|                                       |         |                  |            |            |                        |

**Example:** 

```json
{
    "type": "agent",
    "destination": "host",
    "os": [
        "darwin",
        "linux",
        "windows"
    ],
    "context": "markdown content"
}
```

### <a name="target_type"></a>4.1. [Required] Property `root > target > type`

**Title:** The type schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

Must be one of:
* "agent"
* "integration"
* "on-host-integration"
* "pixie"
* "unknown"

**Example:** 

```json
"agent"
```

### <a name="target_destination"></a>4.2. [Required] Property `root > target > destination`

**Title:** The destination schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

Must be one of:
* "application"
* "cloud"
* "host"
* "kubernetes"
* "unknown"

**Example:** 

```json
"host"
```

### <a name="target_os"></a>4.3. [Optional] Property `root > target > os`

**Title:** The os schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | False              |
| **Additional items** | False              |
| **Tuple validation** | See below          |
|                      |                    |

| Each item of this array must be | Description |
| ------------------------------- | ----------- |
| [items](#target_os_items)       | -           |
|                                 |             |

#### <a name="autogenerated_heading_2"></a>4.3.1. root > target > os > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                      |
| --------------------------------------------------- |
| [The first anyOf schema](#target_os_items_anyOf_i0) |
|                                                     |

##### <a name="target_os_items_anyOf_i0"></a>4.3.1.1. Property `root > target > os > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

Must be one of:
* "darwin"
* "linux"
* "windows"

**Examples:** 

```json
"darwin"
```

```json
"linux"
```

**Example:** 

```json
[
    "darwin",
    "linux"
]
```

### <a name="target_context"></a>4.4. [Optional] Property `root > target > context`

**Title:** The context schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"markdown content"
```

## <a name="install"></a>5. [Required] Property `root > install`

**Title:** The install schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                               | Pattern | Type             | Deprecated | Definition | Title/Description      |
| -------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------- |
| + [mode](#install_mode )               | No      | enum (of string) | No         | -          | The mode schema        |
| + [destination](#install_destination ) | No      | object           | No         | -          | The destination schema |
|                                        |         |                  |            |            |                        |

**Example:** 

```json
{
    "mode": "targetedInstall",
    "destination": {
        "recipeName": "infrastructure-agent-installer",
        "nerdletId": "setup-nerdlets.setup-python-integration",
        "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
    }
}
```

### <a name="install_mode"></a>5.1. [Required] Property `root > install > mode`

**Title:** The mode schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

Must be one of:
* "guidedInstall"
* "targetedInstall"
* "nerdlet"
* "link"

**Example:** 

```json
"targetedInstall"
```

### <a name="install_destination"></a>5.2. [Required] Property `root > install > destination`

**Title:** The destination schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                                         | Pattern | Type   | Deprecated | Definition | Title/Description     |
| ------------------------------------------------ | ------- | ------ | ---------- | ---------- | --------------------- |
| - [recipeName](#install_destination_recipeName ) | No      | string | No         | -          | The recipeName schema |
| - [nerdletId](#install_destination_nerdletId )   | No      | string | No         | -          | The nerdletId schema  |
| - [url](#install_destination_url )               | No      | string | No         | -          | The url schema        |
|                                                  |         |        |            |            |                       |

**Example:** 

```json
{
    "recipeName": "infrastructure-agent-installer",
    "nerdletId": "setup-nerdlets.setup-python-integration",
    "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
}
```

#### <a name="install_destination_recipeName"></a>5.2.1. [Optional] Property `root > install > destination > recipeName`

**Title:** The recipeName schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"infrastructure-agent-installer"
```

#### <a name="install_destination_nerdletId"></a>5.2.2. [Optional] Property `root > install > destination > nerdletId`

**Title:** The nerdletId schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"setup-nerdlets.setup-python-integration"
```

#### <a name="install_destination_url"></a>5.2.3. [Optional] Property `root > install > destination > url`

**Title:** The url schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
```

## <a name="fallback"></a>6. [Optional] Property `root > fallback`

**Title:** The fallback schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                                | Pattern | Type             | Deprecated | Definition | Title/Description      |
| --------------------------------------- | ------- | ---------------- | ---------- | ---------- | ---------------------- |
| + [mode](#fallback_mode )               | No      | enum (of string) | No         | -          | The mode schema        |
| + [destination](#fallback_destination ) | No      | object           | No         | -          | The destination schema |
|                                         |         |                  |            |            |                        |

**Example:** 

```json
{
    "mode": "targetedInstall",
    "destination": {
        "recipeName": "infrastructure-agent-installer",
        "nerdletId": "setup-nerdlets.setup-python-integration",
        "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
    }
}
```

### <a name="fallback_mode"></a>6.1. [Required] Property `root > fallback > mode`

**Title:** The mode schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

Must be one of:
* "guidedInstall"
* "targetedInstall"
* "nerdlet"
* "link"

**Example:** 

```json
"targetedInstall"
```

### <a name="fallback_destination"></a>6.2. [Required] Property `root > fallback > destination`

**Title:** The destination schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                                          | Pattern | Type   | Deprecated | Definition | Title/Description     |
| ------------------------------------------------- | ------- | ------ | ---------- | ---------- | --------------------- |
| - [recipeName](#fallback_destination_recipeName ) | No      | string | No         | -          | The recipeName schema |
| - [nerdletId](#fallback_destination_nerdletId )   | No      | string | No         | -          | The nerdletId schema  |
| - [url](#fallback_destination_url )               | No      | string | No         | -          | The url schema        |
|                                                   |         |        |            |            |                       |

**Example:** 

```json
{
    "recipeName": "infrastructure-agent-installer",
    "nerdletId": "setup-nerdlets.setup-python-integration",
    "url": "https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
}
```

#### <a name="fallback_destination_recipeName"></a>6.2.1. [Optional] Property `root > fallback > destination > recipeName`

**Title:** The recipeName schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"infrastructure-agent-installer"
```

#### <a name="fallback_destination_nerdletId"></a>6.2.2. [Optional] Property `root > fallback > destination > nerdletId`

**Title:** The nerdletId schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"setup-nerdlets.setup-python-integration"
```

#### <a name="fallback_destination_url"></a>6.2.3. [Optional] Property `root > fallback > destination > url`

**Title:** The url schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"https://docs.newrelic.com/docs/agents/python-agent/installation/standard-python-agent-install/#install"
```

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans) on 2021-09-24 at 19:23:05 +0000