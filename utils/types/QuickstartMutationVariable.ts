export interface QuickstartAlertInput {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  type: AlertType;
}

export type AlertType = 'BASELINE' | 'STATIC';

export interface QuickstartDocumentation {
  displayName: string;
  url: string;
  description: string;
}

export interface DashboardScreenshot {
  url: string;
}

export interface QuickstartDashboardInput {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  screenshots?: DashboardScreenshot[];
}

interface QuickstartAuthor {
  name: string;
}

export interface QuickstartMetaData {
  alertConditions?: QuickstartAlertInput[];
  authors: QuickstartAuthor[];
  categoryTerms?: string[];
  description: string;
  displayName: string;
  slug?: string;
  documentation?: QuickstartDocumentation[];
  icon: string;
  keywords?: string[];
  sourceUrl?: string;
  summary: string;
  supportLevel?: QuickstartSupportLevel;
  installPlanStepIds?: string[];
  dashboards?: QuickstartDashboardInput[];
  dataSourceIds?: string[];
}

export type QuickstartSupportLevel =
  | 'COMMUNITY'
  | 'ENTERPRISE'
  | 'NEW_RELIC'
  | 'VERIFIED';

export interface QuickstartMutationVariable {
  id: string;
  dryRun: boolean;
  quickstartMetadata: QuickstartMetaData;
}
