// check_quickstart_uniqueness
export interface IdsAndPaths {
  id: string;
  path: string;
};

export type FilePathAndContents = {
  path: string;
  contents: ConfigContents[];
};

// used in check-missing-logos check_quickstart_uniqueness generate-uuids
export type ConfigContents = {
  id: string;
  slug: string;
  title: string;
  description: string;
  summary: string;
  level: string;
  authors: string[];
  keywords: string[];
  documentation: Documentation[];
  icon: string;
  installPlans?: any;
};

export type Documentation = {
  name: string;
  url: string;
  description: string;
};
// end check_quickstart_uniqueness

