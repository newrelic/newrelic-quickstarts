/* -- Data source -- */

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
  primary: ArtifactInstall;
  fallback?: ArtifactInstall;
};

export type ArtifactInstall =
  | ArtifactDataSourceConfigNerdletDirective
  | ArtifactDataSourceConfigLinkDirective;

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

/* -- Quickstart -- */

type QuickstartConfigDocumentation = {
  displayName: string;
  description: string;
  url: string;
};

export type ArtifactQuickstartConfigSupportLevel =
  | 'new_relic'
  | 'community'
  | 'verified'
  // Enterprise is deprecated. However some quickstarts still have this support
  // level within their config.
  | 'enterprise';

export interface ArtifactQuickstartConfig {
  quickstartUuid: string;
  description: string;
  displayName: string;
  slug?: string;
  documentation: QuickstartConfigDocumentation[];
  iconUrl: string;
  keywords?: string[];
  summary: string;
  supportLevel: ArtifactQuickstartConfigSupportLevel;
  alertConditions?: string[];
  dashboards?: string[];
  dataSourceIds?: string[];
  authors: Array<{ name: string }>;
};

/* -- Dashboard -- */

type DashboardScreenshot = {
  url: string;
};

export interface ArtifactDashboardConfig {
  [id: string]: {
    description?: string;
    displayName: string;
    rawConfiguration: string;
    sourceUrl?: string;
    screenshots?: DashboardScreenshot[];
  };
}

/* --- Alert --- */

export type ArtifactAlertType = 'baseline' | 'static';

type ArtifactAlert = {
  description?: string;
  displayName: string;
  rawConfiguration: string;
  sourceUrl?: string;
  type: ArtifactAlertType;
};

export interface ArtifactAlertConfig {
  [id: string]: ArtifactAlert[];
}
