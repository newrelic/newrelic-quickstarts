import Alert from './Alert';
import Component from './Component';
import Dashboard from './Dashboard';
import DataSource from './DataSource';
import { readQuickstartFile } from '../helpers';
import type { QuickstartConfig } from '../types/QuickstartConfig';
import { QuickstartMutationVariable } from '../types/QuickstartMutationVariable';

type ComponentType = typeof Alert | typeof Dashboard | typeof DataSource;

interface ComponentTypes {
  configKey: string;
  mutationKey: string;
  ctor: ComponentType;
}

const COMPONENT_TYPES: ComponentTypes[] = [
  { configKey: 'alertPolicies', mutationKey: 'alertConditions', ctor: Alert },
  { configKey: 'dashboards', mutationKey: 'dashboards', ctor: Dashboard },
  {
    configKey: 'dataSourceIds',
    mutationKey: 'dataSourceIds',
    ctor: DataSource,
  },
];

abstract class Quickstart extends Component<
  QuickstartConfig,
  QuickstartMutationVariable
> {
  public components: (Dashboard | Alert | DataSource)[];

  constructor(name: string) {
    super(name);

    this.components = this.getComponents();
  }

  getComponents() {
    return COMPONENT_TYPES.flatMap((componentType) => {
      const componentConfig = this.config?.[
        componentType.configKey as keyof QuickstartConfig
      ] as string[];

      return (
        componentConfig.flatMap(
          (name: string) => new componentType.ctor(name)
        ) ?? []
      );
    });
  }

  getMutationVariables() {
    const variables = {
      /* ...name, id, etc */
    };

    const variablesWithComponents = COMPONENT_TYPES.reduce((vars, type) => {
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
    }, variables);

    // FIXME: properly get _all_ of the quickstart variables, not just the component ones
    return variablesWithComponents as QuickstartMutationVariable;
  }

  validate() {
    const invalidComponents = this.components.filter((component) => {
      return !component.isValid;
    });

    if (invalidComponents.length) {
      console.log('The following components are not valid:');

      for (const { localPath } of invalidComponents) {
        console.log(`\t ${localPath}`);
      }

      this.isValid = false;
    }

    // TODO: validate the quickstart itself
  }

  /**
   * Returns the file path from the top level of component
   * @returns - filepath from top level directory.
   */
  getConfigFilePath() {
    // TODO: yml or yaml
    this.configPath = `quickstarts/${this.localPath}/config.yml`;
    return this.configPath;
  }

  /**
   * Read and parse a JSON file
   * @param filePath - The path to the JSON file
   * @returns - An object containing the path and contents of the file
   */
  getConfigContent() {
    // TODO: read the yaml here
    this.config = readQuickstartFile<QuickstartConfig>(this.configPath);
    return this.config;
  }
}

export default Quickstart;
