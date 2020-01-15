import { KeyValueIndexSig } from './key-value-index-sig.model';
import { KeyValuePair } from './key-value-pair.model';

/**
 * Model representation of a mock response
 */
export interface Response {
  headers: KeyValuePair[];
  body: string;
  status: number;
}
