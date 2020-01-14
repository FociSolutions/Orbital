import { KeyValueIndexSig } from './key-value-index-sig.model';
import { KeyValue } from '@angular/common';
import { RuleType } from './rule.type';

/**
 * Model representation of KeyValue pair
 */
export interface KeyValuePair {
  rule: KeyValueIndexSig;
}
