import {
  InstallPlanConfigTargetOS,
  InstallPlanConfigTargetType,
  InstallPlanConfigTargetDestination,
} from './InstallPlanConfig';

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
    nerdletState?: string;
  };
}

interface DefaultDirective {
  mode: string;
  destination?: undefined;
}

export type InstallPlanDestination =
  Uppercase<InstallPlanConfigTargetDestination>;

export type InstallPlanOperatingSystem = Uppercase<InstallPlanConfigTargetOS>;

export type InstallPlanTargetType = Uppercase<InstallPlanConfigTargetType>;
