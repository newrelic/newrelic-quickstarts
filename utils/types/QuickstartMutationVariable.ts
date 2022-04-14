interface QuickstartAlertInput {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  type: string;
}

interface QuickstartDocumentation {
  displayName: string;
  url: string;
  description: string;
}

interface QuickstartDashboardInput {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  screenshots?: string[];
}

interface QuickstartMetaData {
  alertConditions?: QuickstartAlertInput;
  authors: string[];
  categoryTerms?: string[];
  description: string;
  displayName: string;
  slug?: string;
  documentation?: QuickstartDocumentation;
  icon: string;
  keywords?: string[];
  sourceUrl?: string;
  summary: string;
  supportLevel?: string;
  installPlanStepIds?: string[];
  dashboards?: QuickstartDashboardInput;
}

export interface QuickstartMutationVaraible {
  id: string;
  dryRun: boolean;
  quickstartMetadata: QuickstartMetaData;
}
