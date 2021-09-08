# Install Plan File Schema

Install plans define how to install agents, integrations, and instrumentation for a Quickstart. They’re defined once in the /install directory and then are referencable in Quickstart’s config.yml by using the install-plan field.

## Filename format

Install Plans are placed under `install/<plan_type>/install.yml` and can be nested.

For eample:

* `install/apm/java/install.yml`
* `install/infrastructure/infra-agent-standard/install.yml`

## Schema Definition

```yaml
id: string, required

# where the install occurs
# set up context/expectation for what the user is going to need to perform this installation
target: object, required
  type: enum, required                # one of [ agent, integration, on-host-integration, pixie, NPM (net perf monitoring), unknown (special case for guided-install) ]
  destination: enum, required         # one of [ application, host, kubernetes, cloud, unknown (special-case for guided-install) ]
  os: list(enum), optional            # one of [ linux, darwin, windows ]
  context: string(markdown), optional # For display in the right-sidebar

# primary install directive
install: object, required
  mode: enum, required            # one of: [ guidedInstall, targetedInstall, nerdlet, link ] (eventually: documentation, other fields (in-product help XP?) )
  destination: object, required   # required input for the mode to function
    recipeName: string, optional  # valid for mode: [ guidedInstall, targetedInstall ]
    nerdletId: id, optional       # only valid for mode: nerdlet, ex: nerdpackId.nerdletId
    url: string, optional         # valid for mode: link

# secondary install directive
# Note: even though this object is the same shape as `install`, we're choosing
# to make it an explicit field, vs alternatives like having a single `install`
# field that's a list(object) type (as that would be implicit behavior, and
# I'd rather avoid that)
fallback: object, optional
  mode: enum, required            # one of: [ guidedInstall, targetedInstall, nerdlet, link ] (eventually: documentation, other fields (in-product help XP?) )
  destination: object, required   # required input for the mode to function
    recipeName: string, optional  # valid for mode: [ guidedInstall, targetedInstall ]
    nerdletId: id, optional       # only valid for mode: nerdlet, ex: nerdpackId.nerdletId
    url: string, optional         # valid for mode: link

# Add more data fields
# These fields are displayed in the install plan 
title: string, optional       # Display-only field for install plan
description: string, optional # Display-only field for install plan
```
