<!-- toc -->
- [Contributing](#contributing)
  - [Observability Pack Guidelines](#observability-pack-guidelines)
  - [Feature Requests](#feature-requests)
  - [Pull Requests](#pull-requests)
  - [Using Conventional Commits](#using-conventional-commits)
      - [Use `chore`](#use-chore)
      - [Use `fix`](#use-fix)
      - [Use `feat`](#use-feat)
  - [Contributor License Agreement](#contributor-license-agreement)
  - [Slack](#slack)
<!-- tocstop -->

# Contributing

Contributions are always welcome. Before contributing please read the
[code of conduct](https://github.com/newrelic/.github/blob/main/CODE_OF_CONDUCT.md) and [search the issue tracker](../../issues); your issue may have already been discussed or fixed in `main`. To contribute,
[fork](https://help.github.com/articles/fork-a-repo/) this repository, commit your changes, and [send a Pull Request](https://help.github.com/articles/using-pull-requests/).

Note that our [code of conduct](https://github.com/newrelic/.github/blob/main/CODE_OF_CONDUCT.md) applies to all platforms and venues related to this project; please follow it in all your interactions with the project and its participants.


## Observability Pack Guidelines

We encourage all contributors to actively engage in the creation and maintenance of Observability Packs. Whether you work at New Relic or use New Relic as a customer, the community is open to your expertise!

> Review the [pack template config](./_template/config.yml) file for a definition of how to create a pack.

If you decide to create a new Observability Pack or review a PR please keep the following in mind.

* Your new pack must have a unique name
  * The `Validate Packs / Ensure pack names are unique` job handles verifying that there are no collisions when you create a pull request
  * **Note:** Names are stripped of any punctuation and white space is replaced by `-` before doing any comparisons

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

One of the required checks is ensuring that submitted packs and their components are valid. To be valid, a configuration file needs to have all required fields filled out, with all fields having appropriate values. choreThe schemas for those checks live in [utils/schemas](../utils/schemas).

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
