# Contributing

<!-- toc -->
- [Contributing](#contributing)
  - [Welcome 👋](#welcome-)
  - [Quickstarts style guide](#quickstarts-style-guide)
    - [Style tips](#style-tips)
    - [Quickstarts usage](#quickstarts-usage)
    - [Quickstarts description template](#quickstarts-description-template)
  - [Quickstarts contributor guidelines](#quickstarts-contributor-guidelines)
    - [Required field best practices](#required-field-best-practices)
      - [Name](#name)
      - [Description](#description)
      - [Level](#level)
      - [Author](#author)
    - [Optional field best practices](#optional-field-best-practices)
    - [Images or screenshots](#images-or-screenshots)
      - [Image recommended for best results](#image-recommended-for-best-results)
    - [Logos](#logos)
      - [logo recommendations or best results](#logo-recommendations-or-best-results)
    - [Icons](#icons)
    - [Website URLs](#website-urls)
    - [Image requirements](#image-requirements)
    - [Keywords](#keywords)
  - [Feature Requests](#feature-requests)
  - [Pull Requests](#pull-requests)
    - [Status Checks](#status-checks)
      - [Schema Validation](#schema-validation)
      - [Icon and Logo Validation](#icon-and-logo-validation)
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

## Quickstarts style guide

### Style tips

- Maintain a strong active voice. Lead sentences with verbs.
  - Avoid “Allows you to monitor your uptime”
- Avoid being too formal. Avoid words like `thus` and `lastly`, and feel free to use `we` and `our`.
- In general, we should only lightly touch on what a given technology does. The user is already using Node, so we don’t need to sell them on it exactly. What we need to focus on is the challenges of monitoring that technology and then sell on that.

Check out our [doc team's voice and tone guidelines](https://docs.newrelic.com/docs/style-guide/writing-guidelines/voice-strategies-docs-sound-new-relic/).

### Quickstarts usage

When writing about a quickstart the following language rules should be followed:

1. Capitalize the term quickstart if the word is at the start of a sentence or header.

> "Quickstarts are a great way to get started with New Relic!"

2. If the term quickstarts is anywhere else in a sentence, use lower case.

> "New Relic offers you a wide range of quickstarts to get you started."

3. Quickstarts is always a single word.

> "Always use quickstarts, not quick starts."

### Quickstarts description template

```md
Brief overview of the technology. Keep this broad enough to inform users who are unaware of the technology, but it should not dive too deep. 1 paragraph.

Helpful questions:
- What type of technology is it?
- Who are the intended users?
- What differentiates it from competitors and similar technologies?

What you get
Brief overview of visibility provided by key metrics/dashboards/synthetic checks in the kit.. Focus on the specific areas the kit provides visibility to. 1-2 paragraphs.

Helpful questions:
- What makes our instrumentation unique or powerful?
- How does it compare to competitors?
- How does the kit enable the user?
  - A kit for a language may highlight errors while a cloud infrastructure kit might highlight performance or the cluster/node level monitored.
  - Liberally intertwine the technology and New Relic.

Description for each “feature” included in the kit. 1-2 lines.

Dashboards:
  - Example focus: Monitor your transactions
Synthetic monitors
  - Example focus: Proactively monitors your uptime.
Alerts
  - Example focus: Alert triggers when latency exceeds a set limit.
```

## Quickstarts contributor guidelines

We encourage all contributors to actively engage in the creation and maintenance of
quickstarts. Whether you work at New Relic or use New Relic as a customer, the community is open to your expertise!

- `Step 1`: Review the [quickstart Template Config](./_template/config.yml) for a definition of how to create a quickstart.
- `Step 2`: Review the [documentation](https://github.com/newrelic/newrelic-quickstarts/blob/main/docs) for structure and limits you need to consider.
- `Step 3`: Create your quickstart!
- `Step 4`: Submit a PR!
- `Step 5`: resolve feedback from code reviews.
- `Step 6`: after approval, merge your PR.

When creating a new quickstart or reviewing a PR please keep the following in mind, and refer to the
[quickstart validation workflow](https://github.com/newrelic/newrelic-quickstarts/blob/main/.github/workflows/validate_quickstarts.yml) for current validations.

### Required field best practices

#### Name

> The official name of the quickstart.

- `Required`
- limited to 100 characters
- The a Github Action verifies name uniqueness.
- Avoid PR collisions by checking if any [open PRs](https://github.com/newrelic/newrelic-quickstarts/pulls) are using the same name you wish to use.
- Quickstart names are stripped of any punctuation and white space is replaced by `-` before doing any comparisons.

#### Description

> A detailed description of the quickstart and why it's useful.


> See the [docs](https://github.com/newrelic/newrelic-observability-packs/blob/main/docs/main_config.md#description) for more details on `description` and `summary`.

#### Level

> The support level provided for the quickstart.

- `Required`
- set to `Community` level by default
- Can only be modified by New Relic employees to set another level type

#### Author

> The creator(s) or contributors of the quickstart

- `Required`
- No limit to the amount of authors
- A Github Action job verifies quickstart level

```yml
documentation:
  - name: Name of documentation
    description: |
      Description of documentation
    url: >-
      https://docs.newrelic.com/docs/url/
```

### Optional field best practices

Other fields in a quickstart are optional but it's recommended you consider the following to offer the best possible quickstart
experience for users.


### Images or screenshots

> Images of dashboards, visualizations, or nerdpacks.

- `Optional`
- file name should be `quickstart_name01`, `quickstart_name02`, etc
- Images for dashboards should be stored in the quickstart's dashboard directory. ex: `/quickstart_name01/dashboards`.
- Icons and logo files should go in the root quickstart directory, `/quickstarts_name01`
- jpeg or png format
- 4MB or smaller
- 6 max images

#### Image recommended for best results

- Aspect ratio: 3:2
- 800 px (width)
- 1600 px (height)

### Logos

> The logo or brand image of the quickstart.

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

> a reference to a website relating to the quickstart.

- `Optional`
- Valid URL only https://www.newrelic.com

### Image requirements

In order for your PR to pass Validation, the images included in your quickstart must meet the following requirements:

 - Must be in `.png`, `.jpg`, `.jpeg` or `.svg` format
 - Each image file must be less than `4MB` in size
 - There should be no more than `6` images in your quickstart's component folders

### Keywords

When adding keywords to a quickstart the following format should be used.  Keywords are used in UI navigation, filters and labels within
the New Relic One I/O Catalog and the External I/O Catalog.

``` yml
keywords:
  - a keyword
  - another keyword
  - yet another keyword
```

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

One of the required checks is ensuring that submitted quickstarts and their components are valid. To be valid, a configuration file needs to have all required fields filled out, with all fields having appropriate values. The schemas for those checks live in [utils/schemas](./utils/schemas).

#### Icon and Logo Validation

If icon and logo are supplied in the config, this check ensures that the referenced images exist.

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
