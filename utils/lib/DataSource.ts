import * as path from 'path';
import * as glob from 'glob';
import * as fs from 'fs';
import * as yaml from 'js-yaml';

import Component from './Component';
import { DATA_SOURCE_MUTATION, GITHUB_RAW_BASE_URL } from '../constants';

import { fetchNRGraphqlResults } from './nr-graphql-helpers';

import type {
  DataSourceConfig,
  DataSourceConfigInstallDirective,
} from '../types/DataSourceConfig';
import type {
  DataSourceInstallDirectiveInput,
  DataSourceMutationVariable,
} from '../types/DataSourceMutationVariable';

export interface DataSourceMutationResponse {
  dataSource: {
    id: string;
  };
}

export interface DataSourceContext {
  coreDataSourceIds?: string[];
}

class DataSource extends Component<DataSourceConfig, string> {
  private isCoreDataSource: boolean = false;

  constructor(
    identifier: string,
    basePath: string = path.join(__dirname, '..', '..'),
    context: DataSourceContext = {}
  ) {
    super(identifier, basePath);
    const coreDataSourceIds = context?.coreDataSourceIds ?? []
    this.isCoreDataSource = coreDataSourceIds?.includes(identifier) ?? false;

    // The `super()` constructor gets called prior to `this.isCoreDataSource`
    // is defined. Due to this, the instance of a data source will
    // initially be marked as `invalid`.
    if (this.isCoreDataSource) {
      this.identifier = identifier;
      this.isValid = true;

      // Since we know this is a CORE data source,
      // when a quickstart submits a mutation, it relys on the
      // data source component to supply the 'ID' of the data source.

      // The data source doesn't live in this repository, so we can
      // give supply the mutation variables what it wants (the data source ID)
      this.config = { id: this.identifier } as DataSourceConfig;
    }
  }

  /**
   * @returns Filepath for the configuration file (from top-level directory).
   */
  getConfigFilePath() {
    const id = this.identifier;

    // iterate through all data sources and read the contents of each file
    const allDataSources = getAllDataSourceFiles(this.basePath).map((p) => ({
      filePath: p,
      content: yaml.load(
        fs.readFileSync(p).toString('utf-8')
      ) as DataSourceConfig,
    }));

    // find the matching data source ID from the config content
    const dataSource = allDataSources.find((i) => i.content?.id === id);

    // replace the identifier with the file path found from the id
    this.identifier = path.dirname(
      Component.removeBasePath(
        dataSource?.filePath ?? '',
        path.join(this.basePath, 'data-sources')
      )
    );

    // grab the config files from the identifier file path
    const filePaths = glob.sync(
      path.join(
        this.basePath,
        'data-sources',
        this.identifier,
        'config.+(yml|yaml)'
      )
    );

    // validate the data source ID exists and ensure there is only
    // one config file at that location
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
   * @returns The ID for this data source
   */
  getMutationVariables(): DataSourceConfig['id'] {
    return this.config.id;
  }

  /**
   * Get the **component-specific** mutation variables.
   */
  private _getComponentMutationVariables(
    dryRun: boolean = true
  ): DataSourceMutationVariable {
    const { id, displayName, categoryTerms, keywords, description } =
      this.config;

    const dataSourceMetadata = {
      displayName: displayName && displayName.trim(),
      icon: this._getIconUrl(),
      install: this._parseInstall(),
      categoryTerms: categoryTerms && categoryTerms.map((t) => t.trim()),
      keywords: keywords && keywords.map((k) => k.trim()),
      description: description && description.trim(),
    };

    return {
      dryRun,
      id,
      dataSourceMetadata,
    };
  }

  public async submitMutation(dryRun = true) {
    if (!this.isValid) {
      console.error(
        `Data source is invalid.\nPlease check the dashboard at ${this.identifier}\n`
      );
    }

    const { data, errors } = await fetchNRGraphqlResults<
      DataSourceMutationVariable,
      DataSourceMutationResponse
    >({
      queryString: DATA_SOURCE_MUTATION,
      variables: this._getComponentMutationVariables(dryRun),
    });

    // filePath may need to be changed for this rework
    return { data, errors, name: this.identifier };
  }

  /**
   * Helper method to get the image URL for the icon.
   */
  private _getIconUrl() {
    const { icon } = this.config;
    const dirName = path.dirname(this.configPath);
    const relDirName = Component.removeBasePath(dirName, this.basePath);

    return `${GITHUB_RAW_BASE_URL}/${relDirName}/${icon}`;
  }

  /**
   * Helper method to parse the primary and fallback install directives.
   */
  private _parseInstall() {
    const { install } = this.config;

    return {
      primary: this._parseInstallDirective(install.primary),
      fallback:
        install.fallback && this._parseInstallDirective(install.fallback),
    };
  }

  /**
   * Helper method that returns the directive, based on it's type.
   */
  private _parseInstallDirective(
    directive: DataSourceConfigInstallDirective
  ): DataSourceInstallDirectiveInput {
    if ('link' in directive) {
      const { url } = directive.link;

      return {
        link: {
          url: url?.trim() ?? '',
        },
      };
    }

    if ('nerdlet' in directive) {
      const { nerdletId, nerdletState, requiresAccount } = directive.nerdlet;

      return {
        nerdlet: {
          nerdletId: nerdletId?.trim() ?? '',
          nerdletState: nerdletState && JSON.stringify(nerdletState),
          requiresAccount: requiresAccount,
        },
      };
    }

    return directive;
  }
}

const getAllDataSourceFiles = (
  basePath: string = path.join(__dirname, '..', '..')
): string[] => 
  glob.sync(path.join(basePath, 'data-sources', '**', 'config.+(yml|yaml)'));

export default DataSource;
