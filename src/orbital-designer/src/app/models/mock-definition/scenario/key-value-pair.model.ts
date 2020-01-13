import { KeyValue } from '@angular/common';
import { RuleType } from './rule.type';

/**
 * Model representation of KeyValue pair
 */
export interface KeyValuePair {
  rule: KeyValue<string, string>;
}
