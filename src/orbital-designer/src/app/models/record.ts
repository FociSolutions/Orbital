import { cloneDeep } from 'lodash';

/**
 * Converts the list of records into an array copies of the values
 * @deprecated Do not use, to be removed after refactoring code
 */
export function recordMap<T, TResult>(record: Record<string, T>, fn: (record: T) => TResult): TResult[] {
  return Object.values(record).map((x) => fn(cloneDeep(x)));
}

/**
 * Performs a shallow equality check on two objects.
 * @deprecated Do not use, to be removed after refactoring code
 * @param record The first object to compare
 * @param recordToCompare The second object to compare
 * @returns true if the objects have the same keys with the same values, false otherwise
 */
export function compareRecords<T>(record: Record<string, T>, recordToCompare: Record<string, T>): boolean {
  const keys = Object.keys(record);
  const keysToCompare = Object.keys(recordToCompare);

  if (keys.length !== keysToCompare.length) {
    return false;
  }

  for (const key of keys) {
    if (record[key] !== recordToCompare[key]) {
      return false;
    }
  }

  return true;
}
