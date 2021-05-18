export type AlertsNrqlBaselineCondition = {
    accountId: number,
    condition: ConditionTypeInput,
    policyId: string | number
}

export type AlertsUnion = AlertsNrqlConditionBaselineInput | AlertsNrqlConditionOutlierInput | AlertsNrqlConditionStaticInput

export type ConditionTypeInput = {
    condition: AlertsNrqlConditionBaselineInput | AlertsNrqlConditionOutlierInput | AlertsNrqlConditionStaticInput
}

export type AlertsNrqlConditionBaselineInput = {
    baselineDirection: AlertsNrqlBaselineDirection,
    description: string,
    enabled: boolean,
    expiration: AlertsNrqlConditionExpirationInput,
    name: string,
    nrql: AlertsNrqlConditionQueryInput,
    runbookUrl: string,
    signal: AlertsNrqlConditionSignalInput,
    terms: Array<AlertsNrqlDynamicConditionTermsInput>,
    violationTimeLimit: AlertsViolationTimeLimit,
    violationTimeLimitSeconds: number,
    type?: string
}

enum AlertsNrqlBaselineDirection {
    'LOWER_ONLY',
    'UPPER_AND_LOWER',
    'UPPER_ONLY'
}

type AlertsNrqlConditionExpirationInput = {
    closeViolationsOnExpiration: boolean,
    expirationDuration: number,
    openViolationOnExpiration: boolean
}

type AlertsNrqlConditionQueryInput = {
    evaulationOffset?: number,
    query: string
}

type AlertsNrqlConditionSignalInput = {
    aggregationWindow: number,
    evaluationOffset: number,
    fillOption: AlertsFillOption,
    fillValue: number
}

enum AlertsFillOption {
    'LAST_VALUE',
    'NONE',
    'STATIC'
}

type AlertsNrqlDynamicConditionTermsInput = {
    operator: AlertsNrqlDynamicConditionTermsOperator,
    priority: AlertsNrqlConditionPriority,
    threshold: number,
    thresholdDuration: number,
    thresholdOccurences: AlertsNrqlConditionThresholdOccurences
}

enum AlertsNrqlDynamicConditionTermsOperator {
    'ABOVE',
    'BELOW', 
    'EQUALS'
}

enum AlertsNrqlConditionPriority {
    'CRITICAL',
    'WARNING'
}

enum AlertsNrqlConditionThresholdOccurences {
    'ALL',
    'AT_LEAST_ONCE'
}

enum AlertsViolationTimeLimit {
    'EIGHT_HOURS',
    'FOUR_HOURS',
    'NON_MATCHABLE_LIMIT_VALUE',
    'ONE_HOUR',
    'THIRTY_DAYS',
    'TWELVE_HOURS',
    'TWENTY_FOUR_HOURS',
    'TWO_HOURS'
}

export type AlertsNrqlConditionOutlierInput = {
    descritption: string,
    enabled: boolean,
    expectedGroups: number,
    expiration: AlertsNrqlConditionExpirationInput,
    name: string,
    nrql: AlertsNrqlConditionQueryInput,
    openViolationOnGroupOverlap: boolean,
    runbookUrl: string,
    signal: AlertsNrqlConditionSignalInput,
    terms: Array<AlertsNrqlDynamicConditionTermsInput>,
    violationTimeLimit: AlertsViolationTimeLimit,
    violationTimeLimitSeconds: number,
    type?: string
}

export type AlertsNrqlConditionStaticInput = {
    description: string,
    enabled: boolean,
    expiration: AlertsNrqlConditionExpirationInput,
    name: string,
    nrql: AlertsNrqlConditionQueryInput,
    runbookUrl: string,
    signal: AlertsNrqlConditionSignalInput,
    terms: Array<AlertsNrqlDynamicConditionTermsInput>,
    valueFunction: AlertsNrqlStaticConditionValueFunction,
    violationTimeLimit: AlertsViolationTimeLimit,
    violationTimeLimitSeconds: number,
    type?: string
}

enum AlertsNrqlStaticConditionValueFunction {
    'SINGLE_VALUE',
    'SUM'
}
