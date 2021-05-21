import { gql } from 'graphql-request';

export const addPolicy = gql`
	mutation ($accountId: Int!, $name: String!) {
		alertsPolicyCreate(accountId: $accountId, policy: { incidentPreference: PER_CONDITION, name: $name }) {
			name
			incidentPreference
			id
			accountId
		}
	}
`;

export const checkIfPolicyExists = gql`
	query policiesSearch($accountId: Int!, $cursor: String) {
		actor {
			account(id: $accountId) {
				alerts {
					policiesSearch(cursor: $cursor) {
						nextCursor
						policies {
							name
							id
						}
					}
				}
			}
		}
	}
`;

export const removePolicy = gql`
	mutation ($accountId: Int!, $id: ID!) {
		alertsPolicyDelete(accountId: $accountId, id: $id) {
			id
		}
	}
`;
