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

# The name of the pack displayed everywhere the pack is referenced
title: string, optional

# Name acts as a unique identifier for this observability pack
# Formatted as hyphenated lowercase
# Example: apache, golden-signals-for-web-servers
name: string, required

# A long form description for this Observability Pack.
description: string, required

# Displayed in search results and recommendations. Summarizes a packs functionality.
# A short form description for this Observability Pack.
summary: string, required

# Level categorization of Observability Pack
level: enum, required # One of [ New Relic, Verified, Community ]

# List of contributors for this Observability Pack
authors: list, required

# Tags for filtering / searching criteria
tags: list(string), optional

# path to icon for this Observability Pack
# Not currently used
icon: string, optional

# path to logo for this Observability Pack
logo: string, optional

# URL of website for this Observability Pack
website: string, optional

# Instrumentation Requirements - indicates what's needed in an account
# for a given pack (and it's components) to work.
#
# It's important that we're able to verify whether or not the user's
# environment meets the requirements for the use of a given resource.
instrumentation: list(object), optional
  - type: string, optional
    name: string, optional

# Displaying related child packs
# Future feature
children: list(object), optional
  - title: string, optional
    description: string, optional
    screenshots: string, optional

# Contains avatar, GitHub username, and link to GitHub profile for each contributor
# Future feature
contributors: list(object), optional
  - github-username: string, required
    profile-url: string, required
    avatar-url: string, required

# List of docs for this Observability Pack
documentation: list(object), optional
  - name: string, required
    url: string, required
    description: string, optional

```

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).
