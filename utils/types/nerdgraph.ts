export interface NerdGraphError {
  extensions: {
    argumentPath: string[];
  };
  message: string;
}

/**
 * A response from NerdGraph (including possible errors). Requires an
 * expected shape for the response specific to the NerdGraph API call.
 *
 * @example
 * const resp: NerdGraphResponse<{ name: string }> = {
 *   // ...
 * };
 */
export interface NerdGraphResponse<T> {
  data: T;
  errors?: NerdGraphError[];
}

/**
 * Combines the nerdgraph response with any local errors
 * TODO: This is just here to deal with the fact that we are combining
 * different error types together in the response from fetchNRGraphqlResults.
 * We would like to move away from this practice and use the correct type defined above, NerdgraphResponse.
 */
export interface NerdGraphResponseWithLocalErrors<T> {
  data: T;
  errors?: (NerdGraphError | Error)[];
}

/**
 * A request to NerdGraph. An optional type for the `variables` can be
 * provided.
 *
 * @example
 * const request: NerdGraphRequest<{ name: string }> = {
 *   queryString: 'your-query-here',
 *   variables: { name: 'Bob' },
 * };
 */
export interface NerdGraphRequest<T> {
  queryString: string;
  variables?: T;
}
