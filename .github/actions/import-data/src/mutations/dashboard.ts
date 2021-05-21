import { gql } from 'graphql-request';

export const addDashboard = gql`
	mutation ($accountId: Int!, $dashboard: DashboardInput!) {
		dashboardCreate(accountId: $accountId, dashboard: $dashboard) {
			errors {
				description
				type
			}
			entityResult {
				guid
			}
		}
	}
`;

export const checkIfDashboardExists = gql`
	query dashboardSearch($query: String, $cursor: String) {
		actor {
			entitySearch(query: $query) {
				results(cursor: $cursor) {
					entities {
						... on DashboardEntityOutline {
							guid
							name
						}
					}
					nextCursor
				}
			}
		}
	}
`;
export const removeDashboard = gql`
	mutation ($guid: EntityGuid!) {
		dashboardDelete(guid: $guid) {
			errors {
				description
			}
			status
		}
	}
`;
