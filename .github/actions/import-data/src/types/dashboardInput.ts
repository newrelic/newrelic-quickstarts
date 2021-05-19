export type importedDashboardBody = {
	description: string;
	name: string;
	pages: dashboardPageInput[];
	permissions?: string;
	default: dashboardBody;
};

export type dashboardBody = {
	description: string;
	name: string;
	pages: dashboardPageInput[];
	permissions?: string;
};

type dashboardPageInput = {
	description: string;
	guid?: unknown;
	name: string;
	widgets: dashboardWidgetInput[];
};

type dashboardWidgetInput = {
	id?: string;
	title?: string;
	configuration?: dashboardWidgetConfigurationInput;
	layout?: dashboardWidgetLayoutInput;
	linkedEntityGuids?: unknown[];
	rawConfiguration?: unknown;
	visualization?: dashboardWidgetVisualizationInput;
};

type dashboardWidgetConfigurationInput = {
	area?: dashboardBasicWidgetConfigurationInput;
	bar?: dashboardBasicWidgetConfigurationInput;
	billboard?: dashboardBillboardWidgetConfigurationInput;
	line?: dashboardBasicWidgetConfigurationInput;
	markdown?: dashboardMarkdownWidgetConfigurationInput;
	pie?: dashboardBasicWidgetConfigurationInput;
	table?: dashboardBasicWidgetConfigurationInput;
};

type dashboardBasicWidgetConfigurationInput = {
	nrqlQueries: dashboardWidgetNrqlQueryInput[];
};

type dashboardMarkdownWidgetConfigurationInput = {
	text: string;
};

type dashboardBillboardWidgetConfigurationInput = {
	nrqlQueries: dashboardWidgetNrqlQueryInput[];
	thresholds: dashboardBillboardWidgetThresholdInput[];
};

type dashboardBillboardWidgetThresholdInput = {
	value?: number;
	alertSeverity?: severity;
};

enum severity {
	'CRITICAL',
	'NOT_ALERTING',
	'WARNING',
}

type dashboardWidgetNrqlQueryInput = {
	accountId: number;
	query: string;
};

type dashboardWidgetLayoutInput = {
	column?: number;
	height?: number;
	row?: number;
	width?: number;
};

type dashboardWidgetVisualizationInput = {
	id?: string;
};
