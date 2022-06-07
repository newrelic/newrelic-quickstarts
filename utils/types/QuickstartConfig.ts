/**
 * Types in this file correspond to usage in config files.
 *
 * Names and fields may overlap with types used in interactions with NerdGraph.
 */

import { AlertType } from './QuickstartMutationVariable';

export interface QuickstartConfigAlert {
  name: string;
  description: string;
  type: AlertType;
}

export interface QuickstartConfigDocumentation {
  name: string;
  description: string;
  url: string;
}

export interface QuickstartConfig {
  authors: string[];
  description: string;
  title: string;
  slug?: string;
  documentation: QuickstartConfigDocumentation[];
  icon: string;
  keywords?: string[];
  summary: string;
  installPlans?: string[];
  id: string;
  level: QuickstartConfigSupportLevel;
  alertPolicies?: string[];
  dashboards?: string[];
  dataSourceIds?: string[];
}

export type QuickstartConfigSupportLevel =
  | 'New Relic'
  | 'Community'
  | 'Verified';
