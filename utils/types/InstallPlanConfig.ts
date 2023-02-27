/**
 * Types in this file correspond to usage in config files.
 *
 * Names and fields may overlap with types used in interactions with NerdGraph.
 */

export interface InstallPlanConfig {
  id: string;
  name: string;
  title: string;
  description: string;
  target: InstallPlanTarget;
  install: InstallPlanInstall;
  fallback?: InstallPlanInstall;
}

export interface InstallPlanTarget {
  destination: InstallPlanConfigTargetDestination;
  os?: InstallPlanConfigTargetOS[];
  type: InstallPlanConfigTargetType;
}

export type InstallPlanInstall =
  | { mode: 'link'; destination: { url: string } }
  | {
      mode: 'nerdlet';
      destination: {
        nerdletId: string;
        nerdletState?: { [x: string]: string };
      };
    }
  | { mode: 'targetedInstall'; destination: { recipeName: string } };

export type InstallPlanConfigTargetType =
  | 'integration'
  | 'agent'
  | 'on_host_integration'
  | 'unknown';

export type InstallPlanConfigTargetOS = 'darwin' | 'linux' | 'windows';

export type InstallPlanConfigTargetDestination =
  | 'application'
  | 'cloud'
  | 'host'
  | 'kubernetes'
  | 'unknown';
