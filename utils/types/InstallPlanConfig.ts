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
  fallback: InstallPlanInstall;
}

export interface InstallPlanTarget {
  destination: InstallPlanTargetDestination;
  os?: InstallPlanTargetOS[];
  type: InstallPlanTargetType;
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

type InstallPlanTargetType =
  | 'integration'
  | 'agent'
  | 'on_host_integration'
  | 'unknown';

type InstallPlanTargetOS = 'darwin' | 'linux' | 'windows';

type InstallPlanTargetDestination =
  | 'application'
  | 'cloud'
  | 'host'
  | 'kubernetes'
  | 'unknown';
