import * as fs from 'fs';
import * as yaml from 'js-yaml';

import Quickstart from '../lib/Quickstart';
import DataSource, { getAllDataSourceFiles } from '../lib/DataSource';
import { fetchNRGraphqlResults } from '../lib/nr-graphql-helpers';

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

type PublishedDataSourceSearchResults = {
  actor: {
    nr1Catalog: {
      search: {
        results: {
          id: string;
        }[];
      };
    };
  };
};

const getAllPublishedDataSources = async () => {
  const { data, errors } = await fetchNRGraphqlResults<{}, unknown>({
    queryString: PUBLISHED_DATA_SOURCES_QUERY,
    variables: {},
  });

  const {
    search: { results },
  } = data.actor.nr1Catalog;

  return { results, errors };
};

const getAllCommunityDataSources = () => {
  return getAllDataSourceFiles().map((p) => ({
    filePath: p,
    content: yaml.load(fs.readFileSync(p).toString('utf-8')),
  }));
};

const main = async () => {
  const quickstarts = Quickstart.getAll();
  const coreDataSourceIds = await getAllPublishedDataSources(); // Switch to own full data source query

  // Get CSV that matches installplans to datasources
  // Process csv to data structure
  // Use for map of installPlan Ids to data sources
  // Iterate over quickstarts and find matching data source
};
