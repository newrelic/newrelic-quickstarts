# Pack Config File Schema

The top-level pack config is written in YAML and adheres to the specifications outlined below.

## Filename format

Pack config files are placed under `packs/<pack_name>/config.yml`.

For example:

`packs/apache/config.yml`

## Schema definition

```yaml
#####################
# Metadata
#####################

# Unique identifier for this observability pack
uuid: guid, required

# Display name for observability pack
# Example: Apache
name: string, required

# Deprecate in favor of short-description?
# A short form description for this Observability Pack. Used throughout the platform when displaying the pack.
description: string, required

# url slug for linking on public website
# recommended format: make this a lowercase and hyphenated version
# of the `name` field
slug: string, required

# Level categorization of Observability Pack
level: enum, required # One of [ New Relic, Verified, Community ]

# List of contributors for this Observability Pack
authors: list, required

# Instrumentation Requirements - indicates what's needed in an account
# for a given pack (and it's components) to work.
#
# It's important that we're able to verify whether or not the user's 
# environment meets the requirements for the use of a given resource. 
instrumentation: list(object), optional
  - type: string, optional 
    name: string, optional

#####################
# Content/Design
#####################
# The name of the pack displayed every the pack is referenced
title: string, optional

# Displayed in search results and recommendations
short-description: string, optional

# Displayed on the pack overview/details page formatted into rich text.
# Standardized to a template for the New Relic packs.
full-description: string, optional

# Tags for filtering / searching criteria
tags: list(string), optional

# Displayed in listings and in "my packs"
thumbnail: string, optional

# Only used if pack has a Nerdpack or a Dashboard
screenshots: list(string), optional

# Displaying related child packs
children: list(object), optional
  - title: string, optional
    description: string, optional
    screenshots: string, optional

# Contains avatar, GitHub username, and link to GitHub profile for each contributor
contributors: list(object), optional
  - github-username:
    profile-url:
    avatar-url:

# path to icon for this Observability Pack
icon: string, optional

# path to logo for this Observability Pack
logo: string, optional

# URL of website for this Observability Pack
website: string, optional
```

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).
