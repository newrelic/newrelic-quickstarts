import * as path from 'path';
import Quickstart from './Quickstart';
import type { QuickstartContext } from './Quickstart';
import { COMPONENT_PREFIX_REGEXP } from '../constants';

/**
 * Removes the first two arguments injected by Node
 * @returns - An array of arguments explicitly passed in via the command line
 */
export const passedProcessArguments = (): string[] => process.argv.slice(2);

/**
 * Helper function to return a specific property of an object given a key.
 * Intended to be used in with array methods.
 *
 * @example
 * const people = [{ name: 'Luke', color: 'blue' }, { name: 'Vader', color: 'red' }];
 * const names = people.map(prop('name'));
 */
export const prop =
  <T, K extends keyof T>(key: K) =>
  (obj: T) =>
    obj[key];

/**
 * Gets all quickstarts that use a component
 * @param localComponentPath - the local path to a component, ex: "apache" for the apache dashboard
 * @returns quickstarts that use the passed in component
 */
export const getRelatedQuickstarts = (
  localComponentPath: string,
  context: QuickstartContext
): Quickstart[] =>
  Quickstart.getAll(undefined, context).filter((q) =>
    q.components.some((c) => c.identifier === localComponentPath)
  );

/**
 * Gets the local path for a component
 * @param filePath - the path to a component config file within the repository
 * ex: dashboards/apache/dashboard.json -> apache
 * @returns the "local path" portion of the filepath
 */
export const getComponentLocalPath = (filePath: string): string => {
  const componentPath = filePath.split(COMPONENT_PREFIX_REGEXP).pop() ?? '';
  return path.dirname(componentPath);
};

/**
 * Removes the `newrelic-quickstarts/` path prefix from a string
 * @param filePath - The path to change
 * @returns - The path with the prefix
 */
export const removeRepoPathPrefix = (filePath: string): string => {
  const shortPath = filePath.split(`newrelic-quickstarts/`).pop();
  if (typeof shortPath === 'string') {
    return shortPath;
  }
  return filePath;
};
