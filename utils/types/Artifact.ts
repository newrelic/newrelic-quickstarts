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
  name: string;
  description: string;
  url: string;
}

export type QuickstartConfigSupportLevel =
  | 'New Relic'
  | 'Community'
  | 'Verified';

type QuickstartConfig = {
  id: string;
  description: string;
  title: string;
  slug?: string;
  documentation: QuickstartConfigDocumentation[];
  icon: string;
  keywords?: string[];
  summary: string;
  level: QuickstartConfigSupportLevel;
  alertPolicies?: string[];
  dashboards?: string[];
  dataSourceIds?: string[];
}

export interface ArtifactQuickstartConfig extends QuickstartConfig {
  authors: Array<{ name: string; }>
}
