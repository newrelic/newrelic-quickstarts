export interface InstallPlanYML {
  id: string;
  name: string;
  title: string;
  description: string;
  target: InstallPlanYMLTarget;
  install: InstallPlanYMLInstall;
  fallback: InstallPlanYMLInstall;
}

export interface InstallPlanYMLTarget {
  destination: InstallPlanYMLTargetDestination;
  os?: InstallPlanYMLTargetOS[];
  type: InstallPlanYMLTargetType;
}

export type InstallPlanYMLInstall =
  | { mode: 'link'; destination: { url: string } }
  | {
      mode: 'nerdlet';
      destination: {
        nerdletId: string;
        nerdletState: { [x: string]: string };
      };
    }
  | { mode: 'targetedInstall'; destination: { recipeName: string } };

type InstallPlanYMLTargetType =
  | 'integration'
  | 'agent'
  | 'on_host_integration'
  | 'unknown';

type InstallPlanYMLTargetOS = 'darwin' | 'linux' | 'windows';

type InstallPlanYMLTargetDestination =
  | 'application'
  | 'cloud'
  | 'host'
  | 'kubernetes'
  | 'unknown';
