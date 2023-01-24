export enum QuickstartComponentTypename {
  Dashboard = 'Nr1CatalogQuickstartDashboard',
}

interface QuickstartDataSource {
  id: string;
}

interface QuickstartComponent {
  __typename: QuickstartComponentTypename;
  id: string;
}

interface QuickstartQueryResponseMetadata {
  dataSources: QuickstartDataSource[];
  quickstartComponents: QuickstartComponent[];
}

interface Quickstart {
  metadata: QuickstartQueryResponseMetadata;
}

export type QuickstartComponentsIdsResponse = {
  actor: {
    nr1Catalog: {
      quickstart: Quickstart;
    };
  };
};
