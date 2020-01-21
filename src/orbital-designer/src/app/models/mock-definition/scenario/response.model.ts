import { KeyValuePair } from './key-value-pair.model';

/**
 * Model representation of a mock response
 */
export interface Response {
  headers: Record<string, string>;
  body: string;
  status: number;
}
