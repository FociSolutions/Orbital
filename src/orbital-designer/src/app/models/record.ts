import { cloneDeep } from 'lodash';

/**
 * Converts the list of records into an array, in the form of (key, value)
 * @deprecated Do not use, to be removed after refactoring code
 */
export function recordMap<K extends string | number | symbol, T, TResult>(
  record: Record<K, T>,
  fn: (record: T) => TResult
): TResult[] {
  const keys = Object.keys(record);
  return keys.map((k) => fn(cloneDeep(record[k])));
}

/**
 * Performs a shallow equality check on two objects.
 * @deprecated Do not use, to be removed after refactoring code
 * @param record The first object to compare
 * @param recordToCompare The second object to compare
 * @returns true if the objects have the same keys with the same values, false otherwise
 */
export function compareRecords<K extends string | number | symbol, T>(
  record: Record<K, T>,
  recordToCompare: Record<K, T>
): boolean {
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
