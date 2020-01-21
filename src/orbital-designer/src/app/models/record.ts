import { cloneDeep } from 'lodash';

export function recordAdd<K extends string | number | symbol, T>(record: Record<K, T>, key: K, value: T): Record<K, T> {
  record[key] = value;
  return record;
}

export function recordDelete<K extends string | number | symbol, T>(record: Record<K, T>, key: K): Record<K, T> {
  delete record[key];
  return record;
}

export function recordFirstOrDefault<K extends string | number | symbol, T>(record: Record<K, T>, fallback: T): T {
  const keys = Object.keys(record);

  if (keys.length <= 0) {
    return fallback;
  }

  return record[keys[0]];
}

export function recordMap<K extends string | number | symbol, T, TResult>(record: Record<K, T>, fn: (record: T) => TResult): TResult[] {
  const keys = Object.keys(record);
  return keys.map(k => fn(cloneDeep(record[k])));
}

export function recordSize<K extends string | number | symbol, T>(record: Record<K, T>): number {
  const keys = Object.keys(record);
  return keys.length;
}
