/**
 * Types in this file correspond to usage in config files.
 *
 * Names and fields may overlap with types used in interactions with NerdGraph.
 */

export interface QuickstartConfigAlert {
  name: string;
  description: string;
  type: string;
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
  level: string;
}
