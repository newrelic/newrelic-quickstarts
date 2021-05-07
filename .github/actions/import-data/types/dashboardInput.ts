export type dashboardBody = {
    description: string,
    name: string,
    pages: dashboardPageInput[],
    permissions: string,
}

type dashboardPageInput = {
    description: string,
    guid?: unknown, 
    name: string,
    widgets: dashboardWidgetInput[],
}

type dashboardWidgetInput = {
    id?: string,
    title?: string,
    configuration?: dashboardWidgetConfigurationInput,
    layout?: dashboardWidgetLayoutInput,
    linkedEntityGuids?: unknown[],
    rawConfiguration?: unknown,
    visualization?: dashboardWidgetVisualizationInput,
}

type dashboardWidgetConfigurationInput = {
    area?: dashboardBasicWidgetConfigurationInput,
    bar?: dashboardBasicWidgetConfigurationInput,
    billboard?: dashboardBillboardWidgetConfigurationInput,
    line?: dashboardBasicWidgetConfigurationInput,
    markdown?: dashboardMarkdownWidgetConfigurationInput,
    pie?: dashboardBasicWidgetConfigurationInput,
    table?: dashboardBasicWidgetConfigurationInput,
}

type dashboardBasicWidgetConfigurationInput = {
    nrqlQueries: dashboardWidgetNrqlQueryInput[],
}

// type dashboardAreaWidgetConfigurationInput = {
//     nrqlQueries: dashboardWidgetNrqlQueryInput[],
// }

// type dashboardBarWidgetConfigurationInput = {
//     nrqlQueries: dashboardWidgetNrqlQueryInput[],
// }

// type dashboardLineWidgetConfigurationInput = {
//     nrqlQueries: dashboardWidgetNrqlQueryInput[],
// }

// type dashboardPieWidgetConfigurationInput = {
//     nrqlQueries: dashboardWidgetNrqlQueryInput[],
// }

// type dashboardTableWidgetConfigurationInput = {
//     nrqlQueries: dashboardWidgetNrqlQueryInput[],
// }

type dashboardMarkdownWidgetConfigurationInput = {
    text: string,
}

type dashboardBillboardWidgetConfigurationInput = {
    nrqlQueriees: dashboardWidgetNrqlQueryInput[],
    thresholds: dashboardBillboardWidgetThresholdInput[],
}

type dashboardBillboardWidgetThresholdInput = {
    value?: number,
    alertSeverity?: severity,
}

enum severity {
    'CRITICAL',
    'NOT_ALERTING',
    'WARNING',
}

type dashboardWidgetNrqlQueryInput = {
    accountId: number,
    query: string,
}


type dashboardWidgetLayoutInput = {
    column?: number,
    height?: number,
    row?: number,
    width?: number,
}

type dashboardWidgetVisualizationInput = {
    id?: string,
}
