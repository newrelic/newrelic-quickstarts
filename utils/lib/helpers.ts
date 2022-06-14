import * as path from 'path';

import Quickstart from './Quickstart';

export const COMPONENT_PREFIX_REGEX =
  /^(dashboards|alert-policies|install-plans|data-sources)\//;

/**
 * Gets all quickstarts that use a component
 * @param localComponentPath - the local path to a component, ex: "apache" for the apache dashboard
 * @returns quickstarts that use the passed in component
 */
export const getRelatedQuickstarts = (
  localComponentPath: string
): Quickstart[] =>
  Quickstart.getAll().filter((q) =>
    q.components.some((c) => c.localPath === localComponentPath)
  );

/**
 * Gets the local path for a component
 * @param filePath - the path to a component config file within the repository
 * ex: dashboards/apache/dashboard.json -> apache
 * @returns the "local path" portion of the filepath
 */
export const getComponentLocalPath = (filePath: string): string => {
  const componentPath = filePath.split(COMPONENT_PREFIX_REGEX).pop() ?? '';
  return path.dirname(componentPath);
};
