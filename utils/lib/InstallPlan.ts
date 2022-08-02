import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import Component from './Component';
import { fetchNRGraphqlResults } from './nr-graphql-helpers';
import { INSTALL_PLAN_MUTATION } from '../constants';

import type {
  InstallPlanConfig,
  InstallPlanConfigTargetOS,
  InstallPlanInstall,
} from '../types/InstallPlanConfig';
import type {
  InstallPlanDirectiveInput,
  InstallPlanMutationVariable,
  InstallPlanTargetInput,
} from '../types/InstallPlanMutationVariables';

export interface InstallPlanMutationResponse {
  installPlanStep: {
    id: string;
  };
}

class InstallPlan extends Component<InstallPlanConfig, string> {
  /**
   * @returns Filepath for the configuration file (from top-level directory).
   */
  getConfigFilePath() {
    // Lines next few lines are a hack to allow us to pass in the install plan id
    // as the identifier instead of its path under the `install/` directory, this code then parses all install plans and sets
    // the correct path to the requested install plan
    const id = this.identifier;
    const allInstallPlans = getAllInstallPlanFiles(this.basePath).map((p) => ({
      filePath: p,
      content: yaml.load(
        fs.readFileSync(p).toString('utf-8')
      ) as InstallPlanConfig,
    }));
    const installPlan = allInstallPlans.find((i) => i.content?.id === id);
    this.identifier = path.dirname(
      Component.removeBasePath(
        installPlan?.filePath ?? '',
        path.join(this.basePath, 'install')
      )
    );

    const filePaths = glob.sync(
      path.join(
        this.basePath,
        'install',
        this.identifier,
        'install.+(yml|yaml)'
      )
    );

    if (!Array.isArray(filePaths) || filePaths.length !== 1) {
      this.isValid = false;
      return '';
    }

    return Component.removeBasePath(filePaths[0], this.basePath);
  }

  getConfigContent() {
    return this._getYamlConfigContent();
  }

  /**
   * Get the variables for the **Quickstart** mutation.
   *
   * @returns The ID for this install plan
   */
  getMutationVariables(): string{
    if (!this.isValid) {
      console.error(
        `Install plan is invalid.\nPlease check the install plan at ${this.identifier}\n`
      );
    }
    return this.config.id;
  }

  /**
   * Submits a mutation to NerdGraph for a single install plan.
   */
  public async submitMutation(dryRun = true) {
    if (!this.isValid) {
      console.error(
        `Install plan is invalid.\nPlease check the dashboard at ${this.identifier}\n`
      );
    }

    const { data, errors } = await fetchNRGraphqlResults<
      InstallPlanMutationVariable,
      InstallPlanMutationResponse
    >({
      queryString: INSTALL_PLAN_MUTATION,
      variables: this._getComponentMutationVariables(dryRun),
    });

    return { name: this.config.name, data, errors };
  }

  /**
   * Get the **component-specific** mutation variables.
   *
   * @todo: add this to the abstract class (or create an interface)
   */
  private _getComponentMutationVariables(
    dryRun: boolean
  ): InstallPlanMutationVariable {
    const { id, description, name, title, install, fallback, target } =
      this.config ?? {};

    return {
      dryRun,
      id,
      description,
      displayName: name && name.trim(),
      heading: title && title.trim(),
      primary: install && this._parseInstallDirective(install),
      fallback: fallback && this._parseInstallDirective(fallback),
      target: target && this._buildInstallPlanTargetVariable(),
    };
  }

  /**
   * Helper method that returns the directive, regardless of type.
   */
  private _parseInstallDirective(
    directive: InstallPlanInstall
  ): InstallPlanDirectiveInput {
    const { mode, destination } = directive;

    switch (mode) {
      case 'targetedInstall':
        return {
          targeted: { recipeName: destination && destination.recipeName },
        };

      case 'link':
        return { link: { url: destination && destination.url } };

      case 'nerdlet':
        return {
          nerdlet: {
            nerdletId: destination && destination.nerdletId,
            nerdletState:
              destination && JSON.stringify(destination.nerdletState),
          },
        };

      // Defaults to submitting an invalid directive, so that validation can catch it
      default:
        return { mode, destination: undefined };
    }
  }

  /**
   * Builds the target parameter from the config into the variables for NR Request.
   */
  private _buildInstallPlanTargetVariable(): InstallPlanTargetInput {
    const { target } = this.config;

    const type = target.type.toUpperCase();
    const destination = target.destination.toUpperCase();

    const upperCaseTarget = { type, destination } as InstallPlanTargetInput;

    if ('os' in target && Array.isArray(target.os)) {
      upperCaseTarget.os = target.os.map(
        (str) => str.toUpperCase() as Uppercase<InstallPlanConfigTargetOS>
      );
    }

    return upperCaseTarget;
  }
}

const getAllInstallPlanFiles = (
  basePath: string = path.join(__dirname, '..', '..')
): string[] =>
  glob.sync(path.join(basePath, 'install', '**', 'install.+(yml|yaml)'));

export default InstallPlan;
