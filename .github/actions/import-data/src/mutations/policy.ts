import { gql } from 'graphql-request';

const addPolicy = gql`
	mutation ($accountId: Int!, $name: String!) {
		alertsPolicyCreate(accountId: $accountId, policy: { incidentPreference: PER_CONDITION, name: $name }) {
			name
			incidentPreference
			id
			accountId
		}
	}
`;

export default addPolicy;
