# Quickstarts configuration

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** A minimal schema definition for quickstarts

| Property                           | Pattern | Type             | Deprecated | Definition | Title/Description                    |
| ---------------------------------- | ------- | ---------------- | ---------- | ---------- | ------------------------------------ |
| + [name](#name )                   | No      | string           | No         | -          | The name schema                      |
| + [description](#description )     | No      | string           | No         | -          | The description schema               |
| + [level](#level )                 | No      | enum (of string) | No         | -          | The level schema                     |
| + [authors](#authors )             | No      | array            | No         | -          | The authors schema                   |
| - [installPlans](#installPlans )   | No      | array            | No         | -          | The installPlans schema              |
| + [title](#title )                 | No      | string           | No         | -          | The title schema                     |
| - [summary](#summary )             | No      | string           | No         | -          | The summary schema                   |
| - [keywords](#keywords )           | No      | array            | No         | -          | The keywords schema                  |
| - [children](#children )           | No      | object           | No         | -          | Displaying related child quickstarts |
| - [contributors](#contributors )   | No      | array            | No         | -          | The contributors schema              |
| + [logo](#logo )                   | No      | string           | No         | -          | The logo schema                      |
| - [website](#website )             | No      | string           | No         | -          | The website schema                   |
| - [documentation](#documentation ) | No      | array            | No         | -          | The documentation schema             |
|                                    |         |                  |            |            |                                      |

**Example:** 

```json
{
    "name": "apache",
    "description": "The template quickstart allows you to get visibilility into the performance and available of your example service and dependencies. Use this quickstart together with the mock up integrations.",
    "level": "New Relic",
    "authors": [
        "New Relic"
    ],
    "installPlans": [
        "id-1",
        "id-2"
    ],
    "title": "Apache",
    "short-description": "Short description of quickstart",
    "full-description": "Full description of quickstart",
    "keywords": [
        "filters",
        "for",
        "searching"
    ],
    "children": {
        "title": "Title of Quickstart",
        "description": "Description of child quickstart",
        "screenshots": "Screenshots of child quickstart"
    },
    "contributors": [
        {
            "github-username": "username",
            "profile-url": "profiles-url",
            "avatar-url": "avatar-url"
        }
    ],
    "logo": "logo.png",
    "website": "https://www.newrelic.com",
    "documentation": [
        {
            "name": "How to use this quickstart",
            "url": "https://example.com",
            "description": "A brief summary of what this doc entails."
        }
    ]
}
```

## <a name="name"></a>1. [Required] Property `root > name`

**Title:** The name schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** The overall name of the quickstart in lowercase-hyphenated format

**Example:** 

```json
"apache"
```

## <a name="description"></a>2. [Required] Property `root > description`

**Title:** The description schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** A long form description for this quickstart

| Restrictions   |      |
| -------------- | ---- |
| **Min length** | 0    |
| **Max length** | 4000 |
|                |      |

**Example:** 

```json
"The template quickstart allows you to get visibilility into the performance and available of your example service and dependencies. Use this quickstart together with the mock up integrations."
```

## <a name="level"></a>3. [Required] Property `root > level`

**Title:** The level schema

| Type                      | `enum (of string)`                                                        |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** The support level provided to this quickstart

Must be one of:
* "New Relic"
* "Verified"
* "Community"

**Example:** 

```json
"New Relic"
```

## <a name="authors"></a>4. [Required] Property `root > authors`

**Title:** The authors schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** The support level provided to this quickstart

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | 1                  |
| **Max items**        | N/A                |
| **Items unicity**    | True               |
| **Additional items** | False              |
| **Tuple validation** | See below          |
|                      |                    |

| Each item of this array must be | Description |
| ------------------------------- | ----------- |
| [items](#authors_items)         | -           |
|                                 |             |

### <a name="autogenerated_heading_2"></a>4.1. root > authors > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                    |
| ------------------------------------------------- |
| [The first anyOf schema](#authors_items_anyOf_i0) |
|                                                   |

#### <a name="authors_items_anyOf_i0"></a>4.1.1. Property `root > authors > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"New Relic"
```

**Example:** 

```json
[
    "New Relic"
]
```

## <a name="installPlans"></a>5. [Optional] Property `root > installPlans`

**Title:** The installPlans schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** Reference to install plans located under /install directory

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
| [items](#installPlans_items)    | -           |
|                                 |             |

### <a name="autogenerated_heading_3"></a>5.1. root > installPlans > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                         |
| ------------------------------------------------------ |
| [The first anyOf schema](#installPlans_items_anyOf_i0) |
|                                                        |

#### <a name="installPlans_items_anyOf_i0"></a>5.1.1. Property `root > installPlans > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Examples:** 

```json
"id-1"
```

```json
"id-2"
```

**Example:** 

```json
[
    "id-1",
    "id-2"
]
```

## <a name="title"></a>6. [Required] Property `root > title`

**Title:** The title schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** The name of the quickstart displayed everywhere the quickstart is referenced

**Example:** 

```json
"Title of Quickstart"
```

## <a name="summary"></a>7. [Optional] Property `root > summary`

**Title:** The summary schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** # Displayed in search results and recommendations. Summarizes a quickstarts functionality.

| Restrictions   |     |
| -------------- | --- |
| **Min length** | 0   |
| **Max length** | 500 |
|                |     |

**Example:** 

```json
"Short description of quickstart"
```

## <a name="keywords"></a>8. [Optional] Property `root > keywords`

**Title:** The keywords schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** keywords for filtering / searching criteria in the New Relic Platform and GraphQL API

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
| [items](#keywords_items)        | -           |
|                                 |             |

### <a name="autogenerated_heading_4"></a>8.1. root > keywords > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                     |
| -------------------------------------------------- |
| [The first anyOf schema](#keywords_items_anyOf_i0) |
|                                                    |

#### <a name="keywords_items_anyOf_i0"></a>8.1.1. Property `root > keywords > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"searchFilters"
```

**Example:** 

```json
[
    "searchFilters"
]
```

## <a name="children"></a>9. [Optional] Property `root > children`

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** Displaying related child quickstarts

| Property                                | Pattern | Type   | Deprecated | Definition | Title/Description      |
| --------------------------------------- | ------- | ------ | ---------- | ---------- | ---------------------- |
| - [title](#children_title )             | No      | string | No         | -          | The title schema       |
| - [description](#children_description ) | No      | string | No         | -          | The description schema |
| - [screenshots](#children_screenshots ) | No      | string | No         | -          | The screenshots schema |
|                                         |         |        |            |            |                        |

**Example:** 

```json
{
    "title": "Title of Quickstart",
    "description": "Description of child quickstart",
    "screenshots": "Screenshots of child quickstart"
}
```

### <a name="children_title"></a>9.1. [Optional] Property `root > children > title`

**Title:** The title schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"Title of Quickstart"
```

### <a name="children_description"></a>9.2. [Optional] Property `root > children > description`

**Title:** The description schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"Description of child quickstart"
```

### <a name="children_screenshots"></a>9.3. [Optional] Property `root > children > screenshots`

**Title:** The screenshots schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"Screenshots of child quickstart"
```

## <a name="contributors"></a>10. [Optional] Property `root > contributors`

**Title:** The contributors schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** Contains avatar, GitHub username, and link to GitHub profile for each contributor

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
| [items](#contributors_items)    | -           |
|                                 |             |

### <a name="autogenerated_heading_5"></a>10.1. root > contributors > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                         |
| ------------------------------------------------------ |
| [The first anyOf schema](#contributors_items_anyOf_i0) |
|                                                        |

#### <a name="contributors_items_anyOf_i0"></a>10.1.1. Property `root > contributors > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `{}`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

| Property                                                           | Pattern | Type   | Deprecated | Definition | Title/Description          |
| ------------------------------------------------------------------ | ------- | ------ | ---------- | ---------- | -------------------------- |
| + [github-username](#contributors_items_anyOf_i0_github-username ) | No      | string | No         | -          | The github-username schema |
| + [profile-url](#contributors_items_anyOf_i0_profile-url )         | No      | string | No         | -          | The profile-url schema     |
| + [avatar-url](#contributors_items_anyOf_i0_avatar-url )           | No      | string | No         | -          | The avatar-url schema      |
|                                                                    |         |        |            |            |                            |

**Example:** 

```json
{
    "github-username": "username",
    "profile-url": "profiles-url",
    "avatar-url": "avatar-url"
}
```

##### <a name="contributors_items_anyOf_i0_github-username"></a>10.1.1.1. Property `root > contributors > items > anyOf > The first anyOf schema > github-username`

**Title:** The github-username schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"username"
```

##### <a name="contributors_items_anyOf_i0_profile-url"></a>10.1.1.2. Property `root > contributors > items > anyOf > The first anyOf schema > profile-url`

**Title:** The profile-url schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"profiles-url"
```

##### <a name="contributors_items_anyOf_i0_avatar-url"></a>10.1.1.3. Property `root > contributors > items > anyOf > The first anyOf schema > avatar-url`

**Title:** The avatar-url schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"avatar-url"
```

**Example:** 

```json
[
    {
        "github-username": "username",
        "profile-url": "profiles-url",
        "avatar-url": "avatar-url"
    }
]
```

## <a name="logo"></a>11. [Required] Property `root > logo`

**Title:** The logo schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"logo.png"
```

## <a name="website"></a>12. [Optional] Property `root > website`

**Title:** The website schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** An explanation about the purpose of this instance.

**Example:** 

```json
"https://www.newrelic.com"
```

## <a name="documentation"></a>13. [Optional] Property `root > documentation`

**Title:** The documentation schema

| Type                      | `array`                                                                   |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `[]`                                                                      |
|                           |                                                                           |

**Description:** List of documentation links for this quickstart.

|                      | Array restrictions |
| -------------------- | ------------------ |
| **Min items**        | N/A                |
| **Max items**        | N/A                |
| **Items unicity**    | True               |
| **Additional items** | False              |
| **Tuple validation** | See below          |
|                      |                    |

| Each item of this array must be | Description |
| ------------------------------- | ----------- |
| [items](#documentation_items)   | -           |
|                                 |             |

### <a name="autogenerated_heading_6"></a>13.1. root > documentation > items

| Type                      | `combining`                                                               |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
|                           |                                                                           |

| Any of(Option)                                          |
| ------------------------------------------------------- |
| [The first anyOf schema](#documentation_items_anyOf_i0) |
|                                                         |

#### <a name="documentation_items_anyOf_i0"></a>13.1.1. Property `root > documentation > items > anyOf > The first anyOf schema`

**Title:** The first anyOf schema

| Type                      | `object`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** A collection of name, url, and optional description for a piece of documentation.

| Property                                                    | Pattern | Type   | Deprecated | Definition | Title/Description      |
| ----------------------------------------------------------- | ------- | ------ | ---------- | ---------- | ---------------------- |
| + [name](#documentation_items_anyOf_i0_name )               | No      | string | No         | -          | The name schema        |
| + [url](#documentation_items_anyOf_i0_url )                 | No      | string | No         | -          | The url schema         |
| - [description](#documentation_items_anyOf_i0_description ) | No      | string | No         | -          | The description schema |
|                                                             |         |        |            |            |                        |

**Example:** 

```json
{
    "name": "How to use this quickstart",
    "url": "https://example.com",
    "description": "A brief summary of what this doc entails."
}
```

##### <a name="documentation_items_anyOf_i0_name"></a>13.1.1.1. Property `root > documentation > items > anyOf > The first anyOf schema > name`

**Title:** The name schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** Name or title of the documentation resource.

**Example:** 

```json
"How to use this quickstart"
```

##### <a name="documentation_items_anyOf_i0_url"></a>13.1.1.2. Property `root > documentation > items > anyOf > The first anyOf schema > url`

**Title:** The url schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** The URL for the documentation resource.

**Example:** 

```json
"https://example.com"
```

##### <a name="documentation_items_anyOf_i0_description"></a>13.1.1.3. Property `root > documentation > items > anyOf > The first anyOf schema > description`

**Title:** The description schema

| Type                      | `string`                                                                  |
| ------------------------- | ------------------------------------------------------------------------- |
| **Additional properties** | [[Any type: allowed]](# "Additional Properties of any type are allowed.") |
| **Default**               | `""`                                                                      |
|                           |                                                                           |

**Description:** Brief description / summary of this documentation resource.

**Example:** 

```json
"How to install, enable, and use this quickstart."
```

**Example:** 

```json
[
    {
        "name": "How to use this quickstart",
        "url": "https://example.com",
        "description": "A brief summary of what this doc entails."
    }
]
```

----------------------------------------------------------------------------------------------------------------------------
Generated using [json-schema-for-humans](https://github.com/coveooss/json-schema-for-humans)