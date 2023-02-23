import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';
import * as glob from 'glob';

import Alert from './Alert';
import Dashboard from './Dashboard';
import DataSource from './DataSource';
import Component from './Component';
import {
  MOCK_UUID,
  GITHUB_RAW_BASE_URL,
  QUICKSTART_MUTATION,
} from '../constants';
import {
  fetchNRGraphqlResults,
  getCategoryTermsFromKeywords,
} from './nr-graphql-helpers';
import type {
  QuickstartMutationVariable,
  QuickstartMetaData,
  QuickstartSupportLevel,
} from '../types/QuickstartMutationVariable';
import type { QuickstartConfig } from '../types/QuickstartConfig';

export interface QuickstartMutationResponse {
  quickstart: {
    id: string;
  };
}

interface SupportLevelMap {
  [key: string]: QuickstartSupportLevel;
}

const SUPPORT_LEVEL_ENUMS: SupportLevelMap = {
  'New Relic': 'NEW_RELIC',
  Community: 'COMMUNITY',
  Verified: 'VERIFIED',
};

type ComponentType = typeof Alert | typeof Dashboard | typeof DataSource;
type Components = InstanceType<ComponentType>;

interface ConfigToMutationMap {
  configKey: string;
  mutationKey: string;
  ctor: ComponentType;
}

const ConfigToMutation: ConfigToMutationMap[] = [
  { configKey: 'alertPolicies', mutationKey: 'alertConditions', ctor: Alert },
  { configKey: 'dashboards', mutationKey: 'dashboards', ctor: Dashboard },
  {
    configKey: 'dataSourceIds',
    mutationKey: 'dataSourceIds',
    ctor: DataSource,
  },
];

export interface QuickstartContext {
  coreDataSourceIds?: string[];
}

class Quickstart {
  public components: Components[];
  public identifier: string; // Local path to the component. Ex: python/flask
  public configPath: string; // Absolute path to the config file within the repository
  public config: QuickstartConfig;
  public isValid = true;
  public basePath: string;
  public context: QuickstartContext;

  constructor(
    identifier: string,
    basePath: string = path.join(__dirname, '..', '..'),
    context: QuickstartContext = {} 
  ) {
    this.identifier = identifier;
    this.basePath = basePath;
    this.context = context;
    this.configPath = this.getConfigFilePath();
    this.config = this.getConfigContent();
    this.components = this.getComponents();
  }

  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    return path.join(this.basePath, this.identifier);
  }

  /**
   * Read and parse a JSON file
   * @returns - An object containing the path and contents of the file
   */
  getConfigContent() {
    if (!this.isValid) {
      return this.config;
    }
    try {
      const file: Buffer = fs.readFileSync(this.configPath);

      return yaml.load(file.toString('utf-8')) as QuickstartConfig;
    } catch (e) {
      console.error(`Unable to parse quickstart config at ${this.configPath}`);
      this.isValid = false;

      return this.config;
    }
  }

  /**
   * Retrieve all quickstart components referenced in config
   * @returns - A list of components associated with quickstart.
   */
  getComponents(): Components[] {
    return ConfigToMutation.flatMap((componentType) => {
      const componentConfig = this.config?.[
        componentType.configKey as keyof QuickstartConfig
      ] as string[]; // its gonna be an array of something :smile:

      return (
        componentConfig?.flatMap(
          (name: string) =>
            new componentType.ctor(
              name,
              this.basePath,
              this.context,
            )
        ) ?? []
      );
    });
  }

  /**
   * Get mutation variables from quickstart config
   * @returns - Promised mutation variables for quickstart
   */
  async getMutationVariables(
    dryRun: boolean
  ): Promise<QuickstartMutationVariable> {
    if (!this.isValid) {
      console.error(
        `Quickstart is invalid\nPlease check the quickstart reference at: ${this.identifier}`
      );
    }
    const {
      authors,
      description,
      title,
      slug,
      documentation,
      icon,
      keywords,
      summary,
      installPlans,
      dataSourceIds,
      id,
      level,
    } = this.config;

    const metadata = {
      authors: authors && authors.map((author) => ({ name: author })),
      categoryTerms: await getCategoryTermsFromKeywords(keywords),
      description: description && description.trim(),
      displayName: title && title.trim(),
      slug: slug && slug.trim(),
      documentation:
        documentation &&
        documentation.map((doc) => ({
          displayName: doc.name,
          url: doc.url,
          description: doc.description,
        })),
      icon: icon && this._constructIconUrl(icon),
      keywords: keywords,
      sourceUrl: Component.getAssetSourceUrl(
        Component.removeBasePath(path.dirname(this.configPath), this.basePath)
      ),
      summary: summary && summary.trim(),
      supportLevel: SUPPORT_LEVEL_ENUMS[level],
      installPlanStepIds: installPlans,
      dataSourceIds: dataSourceIds,
    };

    const quickstartMetadata = this._addComponents(metadata);

    // TODO: quickstarts define a set of alert conditions, but we are defining them
    // as an array of alert policies. Until the API is updated to accept policies,
    // we need to flatten them down to one array of conditions
    if (quickstartMetadata.alertConditions) {
      quickstartMetadata.alertConditions =
        quickstartMetadata.alertConditions.flat();
    }

    return {
      id: id ? id : MOCK_UUID,
      dryRun,
      quickstartMetadata,
    };
  }

  public async submitMutation(dryRun = true) {
    const { data, errors } = await fetchNRGraphqlResults<
      QuickstartMutationVariable,
      QuickstartMutationResponse
    >({
      queryString: QUICKSTART_MUTATION,
      variables: await this.getMutationVariables(dryRun),
    });

    // filePath may need to be changed for this rework
    return { data, errors, name: this.identifier };
  }

  private _constructIconUrl(icon: string) {
    const splitConfigPath = Component.removeBasePath(
      path.dirname(this.configPath),
      this.basePath
    );
    return `${GITHUB_RAW_BASE_URL}/${splitConfigPath}/${icon}`;
  }

  private _addComponents(metadata: QuickstartMetaData) {
    return ConfigToMutation.reduce((vars, type) => {
      const componentsOfType = this.components.filter(
        (c) => c instanceof type.ctor
      );

      // if we don't have anything for this component type, just return the variables
      if (!componentsOfType.length) {
        return vars;
      }

      // otherwise, we have some components of this type
      // add them to the mutation variables
      const variablesForType = componentsOfType.map((c) =>
        c.getMutationVariables()
      );

      return {
        ...vars,
        [type.mutationKey]: variablesForType,
      };
    }, metadata);
  }

  validate() {
    const invalidComponents = this.components.filter((component) => {
      return !component.isValid;
    });

    if (invalidComponents.length) {
      console.error('The following components are not valid:');

      for (const invalidComponent of invalidComponents) {
        console.error(`\t ${invalidComponent}`);
      }

      this.isValid = false;
    }
  }

  /**
   * Static method that returns a list of every quickstarts
   * @returns - A list of all quickstarts
   */
  static getAll(basePath?: string, context?: QuickstartContext ): Quickstart[] {
    const quickstartRoot = basePath ?? path.join(__dirname, '..', '..');
    const quickstartContext = context ?? {};
    return glob
      .sync(
        path.join(quickstartRoot, 'quickstarts', '**', 'config.+(yml|yaml)')
      )
      .map((quickstartPath) => quickstartPath.split('/quickstarts/').pop()!)
      .map(
        (localPath) =>
          new Quickstart(`quickstarts/${localPath}`, quickstartRoot, quickstartContext)
      );
  }
}

export default Quickstart;
