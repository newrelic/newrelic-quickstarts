export interface InstallPlanMutationVariable {
  dryRun: boolean;
  description: string;
  displayName: string;
  fallback?: InstallPlanDirectiveInput;
  heading: string;
  id: string;
  primary: InstallPlanDirectiveInput;
  target: InstallPlanTargetInput;
}

export interface InstallPlanTargetInput {
  destination: InstallPlanDestination;
  os?: InstallPlanOperatingSystem[];
  type: InstallPlanTargetType;
}

export type InstallPlanDirectiveInput =
  | TargetedInstallDirective
  | LinkDirective
  | NerdletDirective
  | DefaultDirective;

interface TargetedInstallDirective {
  targeted: {
    recipeName: string;
  };
}

interface LinkDirective {
  link: {
    url: string;
  };
}

interface NerdletDirective {
  nerdlet: {
    nerdletId: string;
    nerdletState: string;
  };
}

interface DefaultDirective {
  mode: string;
  destination: undefined;
}

export type InstallPlanDestination =
  | 'APPLICATION'
  | 'CLOUD'
  | 'HOST'
  | 'KUBERNETES'
  | 'UNKNOWN';
export type InstallPlanOperatingSystem = 'DARWIN' | 'LINUX' | 'WINDOWS';
export type InstallPlanTargetType =
  | 'AGENT'
  | 'INTEGRATION'
  | 'ON_HOST_INTEGRATION'
  | 'UNKNOWN';
