export interface DataSourceMutationVariable {
  id: string;
  dryRun: boolean;
  dataSourceMetadata: DataSourceMetadataInput;
}

export interface DataSourceMetadataInput {
  categoryTerms?: string[];
  keywords?: string[];
  description?: string;
  displayName: string;
  icon?: string;
  install: DataSourceInstallInput;
}

export interface DataSourceInstallInput {
  primary: DataSourceInstallDirectiveInput;
  fallback?: DataSourceInstallDirectiveInput;
}

export type DataSourceInstallDirectiveInput =
  | DataSourceLinkDirectiveInput
  | DataSourceNerdletDirectiveInput;

interface DataSourceLinkDirectiveInput {
  link: {
    url: string;
  };
}

interface DataSourceNerdletDirectiveInput {
  nerdlet: {
    nerdletId: string;
    nerdletState?: string;
    requiresAccount: boolean;
  };
}
