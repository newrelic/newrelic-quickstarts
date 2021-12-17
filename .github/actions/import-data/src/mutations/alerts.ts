import { gql } from 'graphql-request';

export const baselineMutation = gql`
	mutation ($accountId: Int!, $policyId: ID!, $condition: AlertsNrqlConditionBaselineInput!) {
		alertsNrqlConditionBaselineCreate(accountId: $accountId, condition: $condition, policyId: $policyId) {
			runbookUrl
			policyId
		}
	}
`;

export const staticMutation = gql`
	mutation ($accountId: Int!, $policyId: ID!, $condition: AlertsNrqlConditionStaticInput!) {
		alertsNrqlConditionStaticCreate(accountId: $accountId, condition: $condition, policyId: $policyId) {
			runbookUrl
			policyId
		}
	}
`;
