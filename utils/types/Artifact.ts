export interface ArtifactDataSourceConfig {
  id: string;
  displayName: string;
  description?: string;
  install: ArtifactInstallDirective;
  keywords?: string[];
  categoryTerms?: string[];
  iconUrl?: string;
}

export type ArtifactInstallDirective = {
  primary: ArtifactInstall,
  fallback?: ArtifactInstall
}

export type ArtifactInstall = ArtifactDataSourceConfigNerdletDirective | ArtifactDataSourceConfigLinkDirective;

interface ArtifactDataSourceConfigNerdletDirective {
  nerdletId: string;
  nerdletState: Record<string, string>;
  requiresAccount: boolean;
}

interface ArtifactDataSourceConfigLinkDirective {
  url: string;
}

interface ArtifactDataSourceConfigNerdletDirective {
  nerdletId: string;
  nerdletState: Record<string, string>;
  requiresAccount: boolean;
}

type DashboardScreenshot = {
  url: string;
}

export interface ArtifactDashboardConfig {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  screenshots?: DashboardScreenshot[];
}

type QuickstartConfigDocumentation = {
  displayName: string;
  description: string;
  url: string;
}

export type QuickstartConfigSupportLevel =
  |'NEW_RELIC'
  |'COMMUNITY'
  |'VERIFIED'
  |'ENTERPRISE';

type QuickstartConfig = {
  quickstartUuid: string;
  description: string;
  displayName: string;
  slug?: string;
  documentation: QuickstartConfigDocumentation[];
  iconUrl: string;
  keywords?: string[];
  summary: string;
  supportLevel: QuickstartConfigSupportLevel;
  alertPolicies?: string[];
  dashboards?: string[];
  dataSourceIds?: string[];
}

export interface ArtifactQuickstartConfig extends QuickstartConfig {
  authors: Array<{ name: string; }>
}

type AlertType = 'BASELINE' | 'STATIC';

type ArtifactAlert  = {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  type: AlertType;
}

export interface ArtifactAlertConfig {
  [id: string]: ArtifactAlert[]
}
