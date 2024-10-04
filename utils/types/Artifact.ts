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
