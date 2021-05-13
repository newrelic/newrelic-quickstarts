export type AlertsPolicy = {
    accountId: number,
    policy: AlertsPolicyInput
}

export type AlertsPolicyInput = {
    incidentPreference: AlertsIncidentPreference,
    name: string
}

enum AlertsIncidentPreference {
    'PER_CONDITION',
    'PER_CONDITION_AND_TARGET',
    'PER_POLICY'
}
