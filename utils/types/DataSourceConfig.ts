export interface DataSourceConfig {
  id: string;
  displayName: string;
  description?: string;
  install: DataSourceConfigInstallDirective;
  keywords?: string[];
  categoryTerms?: string[];
}

export type DataSourceConfigInstallDirective =
  | DataSourceConfigLinkDirective
  | DataSourceConfigNerdletDirective;

interface DataSourceConfigLinkDirective {
  link: string;
}

interface DataSourceConfigNerdletDirective {
  nerdlet: string;
  nerdletState: Record<string, string>;
  requiresAccount: boolean;
}
