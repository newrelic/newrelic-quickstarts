import * as fs from 'fs';
import * as yaml from 'js-yaml';
import * as path from 'path';

import Quickstart from '../lib/Quickstart';
import DataSource, { getAllDataSourceFiles } from '../lib/DataSource';
import { fetchNRGraphqlResults } from '../lib/nr-graphql-helpers';
import { passedProcessArguments } from '../lib/helpers';

const gql = String.raw;

export const PUBLISHED_DATA_SOURCES_QUERY = gql`
  {
    actor {
      nr1Catalog {
        search(filter: { types: DATA_SOURCE }) {
          results {
            ... on Nr1CatalogDataSource {
              id
              metadata {
                displayName
                install {
                  fallback {
                    __typename
                    ... on Nr1CatalogLinkInstallDirective {
                      url
                    }
                    ... on Nr1CatalogNerdletInstallDirective {
                      nerdletId
                      nerdletState
                    }
                  }
                  primary {
                    __typename
                    ... on Nr1CatalogLinkInstallDirective {
                      url
                    }
                    ... on Nr1CatalogNerdletInstallDirective {
                      nerdletId
                      nerdletState
                    }
                  }
                }
              }
            }
          }
        }
      }
    }
  }
`;

enum InstallDirectiveTypename {
  Link = 'Nr1CatalogLinkInstallDirective',
  Nerdlet = 'Nr1CatalogNerdletInstallDirective',
}

interface CatalogDataSourceLinkInstall {
  __typename: InstallDirectiveTypename.Link;
  url: string;
}

interface CatalogDataSourceNerdletInstall {
  __typename: InstallDirectiveTypename.Nerdlet;
  nerdletId: string;
  nerdletState: Record<string, unknown> | null;
}

type CatalogDataSourceInstall =
  | CatalogDataSourceNerdletInstall
  | CatalogDataSourceLinkInstall;

interface CatalogDataSource {
  id: string;
  metadata: {
    displayName: string;
    install: {
      primary: CatalogDataSourceInstall;
      fallback: CatalogDataSourceInstall | null;
    };
  };
}

interface PublishedDataSourceSearchResults {
  actor: {
    nr1Catalog: {
      search: {
        results: CatalogDataSource[];
      };
    };
  };
}

const getAllPublishedDataSources = async () => {
  const { data, errors } = await fetchNRGraphqlResults<
    {},
    PublishedDataSourceSearchResults
  >({
    queryString: PUBLISHED_DATA_SOURCES_QUERY,
    variables: {},
  });

  const {
    search: { results },
  } = data.actor.nr1Catalog;

  return { results, errors };
};

const parseCSV = (csvString: string) => {
  const csvRows = csvString.split('\r\n');

  return csvRows.reduce((acc: Record<string, string>, row: string, idx) => {
    if (idx === 0) {
      return acc;
    }

    const rowValues = row.split(',');
    const nextAcc = { ...acc, [rowValues[0]]: rowValues[1] };

    return nextAcc;
  }, {});
};

const NOT_DATASOURCE_IDS = ['TO_BE_CREATED', 'MANUAL'];

const main = async () => {
  const [csvRelativePath] = passedProcessArguments();
  const quickstarts = Quickstart.getAll();
  //const publishedDataSources = await getAllPublishedDataSources(); // Switch to own full data source query

  const fullCSVPath = path.resolve(__dirname, csvRelativePath);

  const csvString = fs.readFileSync(fullCSVPath, { encoding: 'utf-8' });
  const installPlansToDataSources = parseCSV(csvString);

  const installPlanIdsWithoutDataSource = [];

  quickstarts.forEach((quickstart) => {
    const installPlanIds = quickstart.config.installPlans ?? [];
    const existingDataSourceIds = quickstart.config.dataSourceIds ?? [];

    if (installPlanIds.length === 0) {
      return;
    }

    const newDataSourceIds = installPlanIds.reduce(
      (acc: string[], installPlanId) => {
        const dataSourceId: string =
          installPlansToDataSources[installPlanId] ?? undefined;

        if (dataSourceId === undefined) {
          installPlanIdsWithoutDataSource.push(installPlanId);
          return acc;
        }

        if (NOT_DATASOURCE_IDS.includes(dataSourceId)) {
          return acc;
        }

        return [...acc, dataSourceId];
      },
      []
    );

    const nextDataSourceIds = [
      ...new Set([...existingDataSourceIds, ...newDataSourceIds]),
    ];

    if (nextDataSourceIds.length === 0) {
      return;
    }

    const qsYaml = yaml.load(
      fs.readFileSync(quickstart.configPath, { encoding: 'utf-8' })
    ) as Record<string, any>;

    qsYaml['dataSourceIds'] = nextDataSourceIds;

    console.log(qsYaml);
    //yml.dump write qs config
  });
};

main();
