export interface QuickstartAlertInput {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  type: string;
}

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
  supportLevel?: string;
  installPlanStepIds?: string[];
  dashboards?: QuickstartDashboardInput[];
}

export interface QuickstartMutationVariable {
  id: string;
  dryRun: boolean;
  quickstartMetadata: QuickstartMetaData;
}

// --------------------- YML / CONFIG Types

// or AlertConfig, etc
export interface AlertYml {
  name: string;
  description: string;
  type: string;
}

export interface QuickstartDocumentationYml {
  name: string;
  description: string;
  url: string;
}

export interface QuickstartConfig {
  authors: string[];
  description: string;
  title: string;
  slug?: string;
  documentation: QuickstartDocumentationYml[];
  icon: string;
  keywords?: string[];
  summary: string;
  installPlans?: string[];
  id: string;
  level: string;
}
