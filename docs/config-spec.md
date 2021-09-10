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

# A machine-generated unique identifier for the pack, DO NOT MANUALLY ADJUST 
id: string, required

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

# DEPRECATED: Use keywords instead
# Tags for filtering / searching criteria
tags: list(string), optional

# Keywords for filtering / searching criteria
keywords: list(string), optional

# path to icon for this Observability Pack
# Not currently used
icon: string, optional

# path to logo for this Observability Pack
logo: string, optional

# URL of website for this Observability Pack
website: string, optional

# Reference to install plans located under /install directory
# Allows us to construct reusable "install plans" and just use their ID in the quickstart config
installPlans: list(string), optional

# List of docs for this Observability Pack
documentation: list(object), optional
  - name: string, required
    url: string, required
    description: string, optional

##################################
# Possible Future Fields
# # Displaying related child packs
# # Future feature
# children: list(object), optional
#   - title: string, optional
#     description: string, optional
#     screenshots: string, optional

# # Contains avatar, GitHub username, and link to GitHub profile for each contributor
# # Future feature
# contributors: list(object), optional
#   - github-username: string, required
#     profile-url: string, required
#     avatar-url: string, required


```

## Schema Validator

See [newrelic-observability-packs/utils/validate_packs.js](../utils/validate_packs.js).
