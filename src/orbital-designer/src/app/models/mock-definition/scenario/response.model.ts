import { KeyValuePairRule } from './key-value-pair-rule.model';

/**
 * Model representation of a mock response
 */
export interface Response {
  headers: KeyValuePairRule;
  body: string;
  status: number;
}
