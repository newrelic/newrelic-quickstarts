import { gql } from 'graphql-request';

const addDashboard = gql`
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

export default addDashboard;
