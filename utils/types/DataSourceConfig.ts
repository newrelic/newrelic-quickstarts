export interface DataSourceConfig {
  id: string;
  displayName: string;
  description?: string;
  install: DataSourceConfigInstall;
  keywords?: string[];
  categoryTerms?: string[];
  icon?: string;
}

export type DataSourceConfigInstall<T = DataSourceConfigInstallDirective> = {
  primary: T;
  fallback?: T;
};

export type DataSourceConfigInstallDirective =
  | DataSourceConfigLinkDirective
  | DataSourceConfigNerdletDirective;

interface DataSourceConfigLinkDirective {
  link: {
    url: string;
  };
}

export interface DataSourceConfigNerdletDirective {
  nerdlet: {
    nerdletId: string;
    nerdletState: Record<string, string>;
    requiresAccount: boolean;
  };
}
