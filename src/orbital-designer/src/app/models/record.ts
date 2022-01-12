import { cloneDeep } from 'lodash';

/**
 * Adds a record
 */
export function recordAdd<K extends string | number | symbol, T>(record: Record<K, T>, key: K, value: T): Record<K, T> {
  record[key] = value;
  return record;
}

/**
 * Deletes a record
 */
export function recordDelete<K extends string | number | symbol, T>(record: Record<K, T>, key: K): Record<K, T> {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete record[key];
  return record;
}

/**
 * Updates an existing record with a new key name
 */
export function recordUpdateKeyName<K extends string | number | symbol, T>(
  o: Record<K, T>,
  oldKey: K,
  newKey: K
): Record<K, T> {
  if (oldKey !== newKey) {
    Object.defineProperty(o, newKey, Object.getOwnPropertyDescriptor(o, oldKey));
    // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
    delete o[oldKey];
  }

  return o;
}

/**
 * Returns the first record, or a default value
 */
export function recordFirstOrDefault<K extends string | number | symbol, T>(record: Record<K, T>, fallback: T): T {
  const keys = Object.keys(record);

  if (keys.length <= 0) {
    return fallback;
  }

  return record[keys[0]];
}

/**
 * Gets the key's name from the provided record
 */
export function recordFirstOrDefaultKey<K extends string | number | symbol, T>(
  record: Record<K, T>,
  fallback: string
): string {
  const keys = Object.keys(record);

  if (keys.length <= 0) {
    return fallback;
  }

  return keys[0];
}

/**
 * Converts the list of records into an array, in the form of (key, value)
 */
export function recordMap<K extends string | number | symbol, T, TResult>(
  record: Record<K, T>,
  fn: (record: T) => TResult
): TResult[] {
  const keys = Object.keys(record);
  return keys.map((k) => fn(cloneDeep(record[k])));
}

/**
 * Gets the length of the records
 * @param record The record to get the total length
 */
export function recordSize<K extends string | number | symbol, T>(record: Record<K, T>): number {
  const keys = Object.keys(record);
  return keys.length;
}

/**
 * Performs a shallow equality check on two objects.
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
