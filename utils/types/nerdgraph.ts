export interface NerdGraphError {
  extensions: {
    argumentPath: string[];
  };
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
  data: T & {
    errors?: NerdGraphError[];
  };
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
export interface NerdGraphRequest<T = {}> {
  queryString: string;
  variables?: T;
}

export interface Quickstart