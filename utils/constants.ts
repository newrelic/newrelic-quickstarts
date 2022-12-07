export const GITHUB_REPO_BASE_URL =
  'https://github.com/newrelic/newrelic-quickstarts/tree/main';
export const GITHUB_RAW_BASE_URL =
  'https://raw.githubusercontent.com/newrelic/newrelic-quickstarts/main';

export const IO_PREVIEW_PAGE_URL =
  'https://newrelic.com/instant-observability/preview';

export const QUICKSTART_CONFIG_REGEXP = new RegExp(
  'quickstarts/.+/config.+(yml|yaml)'
);

export const DATA_SOURCE_CONFIG_REGEXP = new RegExp(
  'data-sources/.+/config.+(yml|yaml)'
);

export const COMPONENT_PREFIX_REGEXP =
  /^(dashboards|alert-policies|install-plans|data-sources)\//;

/**
 * Because brand new quickstarts added via a PR do not have an ID until they are assigned one at release,
 * this mock UUID allows for validation to take place knowing a different UUID will be used for the actual release.
 */
export const MOCK_UUID = '00000000-0000-0000-0000-000000000000';

const gql = String.raw;

export const QUICKSTART_MUTATION = gql`
  # gql
  mutation QuickstartRepoQuickstartMutation(
    $dryRun: Boolean
    $id: ID!
    $quickstartMetadata: Nr1CatalogQuickstartMetadataInput!
  ) {
    nr1CatalogSubmitQuickstart(
      dryRun: $dryRun
      id: $id
      quickstartMetadata: $quickstartMetadata
    ) {
      quickstart {
        id
        metadata {
          quickstartComponents {
            ... on Nr1CatalogQuickstartDashboard {
              id
            }
          }
        }
      }
    }
  }
`;

export const INSTALL_PLAN_MUTATION = gql`
  # gql
  mutation QuickstartRepoInstallPlanMutation(
    $description: String!
    $dryRun: Boolean
    $displayName: String!
    $fallback: Nr1CatalogInstallPlanDirectiveInput
    $heading: String!
    $id: ID!
    $primary: Nr1CatalogInstallPlanDirectiveInput!
    $target: Nr1CatalogInstallPlanTargetInput!
  ) {
    nr1CatalogSubmitInstallPlanStep(
      dryRun: $dryRun
      installPlanStep: {
        description: $description
        displayName: $displayName
        fallback: $fallback
        heading: $heading
        id: $id
        primary: $primary
        target: $target
      }
    ) {
      installPlanStep {
        id
      }
    }
  }
`;

export const DATA_SOURCE_MUTATION = gql`
  mutation QuickstartRepoDataSourceMutation(
    $dryRun: Boolean
    $id: ID!
    $dataSourceMetadata: Nr1CatalogDataSourceMetadataInput!
  ) {
    nr1CatalogSubmitDataSource(
      dryRun: $dryRun
      id: $id
      dataSourceMetadata: $dataSourceMetadata
    ) {
      dataSource {
        id
      }
    }
  }
`;

export const CATEGORIES_QUERY = gql`
  {
    actor {
      nr1Catalog {
        categories {
          terms
        }
      }
    }
  }
`;

export const DASHBOARD_REQUIRED_DATA_SOURCES_QUERY = gql`
  query DashboardRequiredDataSourcesQuery($id: ID!) {
    actor {
      nr1Catalog {
        dashboardTemplate(id: $id) {
          metadata {
            requiredDataSources {
              id
            }
          }
        }
      }
    }
  }
`;

export const DASHBOARD_SET_REQUIRED_DATA_SOURCES_MUTATION = gql`
  mutation DashboardSetRequiredDataSourcesMutation(
    $dataSourceIds: [ID!]! 
    templateId: ID!
  ) {
    nr1CatalogSetRequiredDataSourcesForDashboardTemplate(dataSourceIds: $dataSourceIds, dashboardTemplateId: $templateId) {
      dashboardTemplate {
        id
      }
    }
  }
`;
