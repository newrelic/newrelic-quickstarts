# Contributing

<!-- toc -->
- [Contributing](#contributing)
  - [Welcome 👋](#welcome-)
  - [Observability Pack Guidelines](#observability-pack-guidelines)
    - [Required field best practices](#required-field-best-practices)
      - [Name](#name)
      - [Description](#description)
      - [Level](#level)
      - [Author](#author)
      - [Summary](#summary)
    - [Optional field best practices](#optional-field-best-practices)
      - [Title](#title)
      - [PackUrl](#packurl)
    - [Images or screenshots](#images-or-screenshots)
      - [Image recommended for best results](#image-recommended-for-best-results)
    - [Logos](#logos)
      - [logo recommendations or best results](#logo-recommendations-or-best-results)
    - [Icons](#icons)
    - [Website URLs](#website-urls)
    - [Image requirements](#image-requirements)
  - [Feature Requests](#feature-requests)
  - [Pull Requests](#pull-requests)
    - [Status Checks](#status-checks)
      - [Schema Validation](#schema-validation)
  - [Using Conventional Commits](#using-conventional-commits)
      - [Use `chore`](#use-chore)
      - [Use `fix`](#use-fix)
      - [Use `feat`](#use-feat)
  - [Contributor License Agreement](#contributor-license-agreement)
  - [Slack](#slack)
<!-- tocstop -->

## Welcome 👋

Contributions are always welcome. Before contributing please read the
[code of conduct](https://github.com/newrelic/.github/blob/main/CODE_OF_CONDUCT.md)
and [search the issue tracker](../../issues); your issue may have already been discussed or fixed in `main`. To contribute,
[fork](https://help.github.com/articles/fork-a-repo/) this repository, commit your
changes, and [send a Pull Request](https://help.github.com/articles/using-pull-requests/).

Note that our [code of conduct](https://github.com/newrelic/.github/blob/main/CODE_OF_CONDUCT.md)
applies to all platforms and venues related to this project; please follow it in all
your interactions with the project and its participants.

## Observability Pack Guidelines

We encourage all contributors to actively engage in the creation and maintenance of
Observability Packs. Whether you work at New Relic or use New Relic as a customer, the community is open to your expertise!

- `Step 1`: Review the [Pack Template Config](./_template/config.yml) for a definition of how to create a pack.
- `Step 2`: Review the [Pack Config Schema](https://github.com/newrelic/newrelic-observability-packs/blob/main/docs/config-spec.md) for structure and limits you need to consider.
- `Step 3`: Create your pack!
- `Step 4`: Submit a PR!
- `Step 5`: resolve feedback from code reviews.
- `Step 6`: after approval, merge your PR.

When creating a new Observability Pack or reviewing a PR please keep the following in mind, and refer to the
[Packs validation workflow](https://github.com/newrelic/newrelic-observability-packs/blob/main/.github/workflows/validate_packs.yml) for current validations.

### Required field best practices

#### Name

> The official name of the pack.

- `Required`
- limited to 100 characters
- The a Github Action verifies name uniqueness.
- Avoid PR collisions by checking if any [open PRs](https://github.com/newrelic/newrelic-observability-packs/pulls) are using the same name you wish to use.
- Pack names are stripped of any punctuation and white space is replaced by `-` before doing any comparisons.


#### Description

> A detailed description of the pack and why it's useful.

- `Required`
- Markdown or plain text
- limited to 2000 characters
- A Github Action verifies pack descriptions

#### Level

> The support level provided for the pack.

- `Required`
- set to `Community` level by default
- Can only be modified by New Relic employees to set another level type
- A Github Action verifies pack level

#### Author

> The creator(s) or contributors of the pack

- `Required`
- No limit to the amount of authors
- A Github Action job verifies pack level

#### Summary

> A brief summary of the pack functionality.

- `Required`
- Plain text only
- limited to 250 characters

### Optional field best practices

Other fields in a pack are optional but it's recommended you consider the following to offer the best possible pack
experience for users.

#### Title

> an option field used when the pack is referenced.

- `Optional`

#### PackUrl

> URL to link to the location of this Observability Pack in the open source repo

- `Optional`

### Images or screenshots

> Images of dashboards, visualizations, or nerdpacks.

- `Optional`
- jpeg or png format
- 4MB or smaller
- 6 max images

#### Image recommended for best results

- Aspect ratio: 3:2
- 800 px (width)
- 1600 px (height)

### Logos

> The logo or brand image of the pack.

- `Optional`
- .png or .jpeg or .svg format
- Max 1

#### logo recommendations or best results

- Aspect ratio: 1:1
- 250px (width) x 100px (height)

### Icons

- `Optional`
- Not currently used
- .png or .jpeg or .svg format
- Max 1

### Website URLs

> a reference to a website relating to the pack.

- `Optional`
- Valid URL only https://www.newrelic.com

### Image requirements

In order for your PR to pass Validation, the images included in your pack must meet the following requirements:

 - Must be in `.png`, `.jpg`, `.jpeg` or `.svg` format
 - Each image file must be less than `4MB` in size
 - There should be no more than `6` images in your pack's component folders

## Feature Requests

Feature requests should be submitted in the [Issue tracker](../../issues), with a description of the expected behavior & use case, where they’ll remain closed until sufficient interest, [e.g. :+1: reactions](https://help.github.com/articles/about-discussions-in-issues-and-pull-requests/), has been [shown by the community](../../issues?q=label%3A%22votes+needed%22+sort%3Areactions-%2B1-desc).
Before submitting an Issue, please search for similar ones in the
[closed issues](../../issues?q=is%3Aissue+is%3Aclosed+label%3Aenhancement).

## Pull Requests

1. Ensure that all new commits follow the [Conventional Commit](#using-conventional-commits) syntax.
2. Provide a short description of the changes and screenshots of any visual changes.
3. Ensure that all status checks are passing.
4. You may merge the Pull Request in once you have the sign-off of one other developer, or if you do not have permission to do that, you may request the reviewer to merge it for you.

### Status Checks

#### Schema Validation

One of the required checks is ensuring that submitted packs and their components are valid. To be valid, a configuration file needs to have all required fields filled out, with all fields having appropriate values. The schemas for those checks live in [utils/schemas](./utils/schemas).

## Using Conventional Commits

Please help the maintainers by leveraging the following [conventional commit](https://www.conventionalcommits.org/en/v1.0.0/)
standards in your pull request title and commit messages.

#### Use `chore`

- for minor changes / additions / corrections to content.
- for minor changes / additions / corrections to images.
- for minor non-functional changes / additions to github actions, github templates, package or config updates, etc

```bash
git commit -m "chore: adjusting config and content"
```

#### Use `fix`

- for minor functional corrections to code.

```bash
git commit -m "fix: typo and prop error in the code of conduct"
```

#### Use `feat`

- for major functional changes or additions to code.

```bash
git commit -m "feat(media): creating a video landing page"
```

## Contributor License Agreement

Keep in mind that when you submit your Pull Request, you'll need to sign the CLA via the click-through using CLA-Assistant. If you'd like to execute our corporate CLA, or if you have any questions, please drop us an email at opensource@newrelic.com.

For more information about CLAs, please check out Alex Russell’s excellent post,
[“Why Do I Need to Sign This?”](https://infrequently.org/2008/06/why-do-i-need-to-sign-this/).

## Slack

We host a internal project [Slack channel](https://newrelic.slack.com/archives/G01N33Y8P3K) for this project while it's in development. You can contact the teams working on this initiative with any questions here.
