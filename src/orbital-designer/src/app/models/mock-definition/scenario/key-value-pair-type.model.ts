import { RuleType } from './rule.type';
import { KeyValueIndexSig } from './key-value-index-sig.model';

/**
 * Model representation of KeyValue pair matching rule
 */
export interface KeyValuePairType {
  type: RuleType;
  rule: KeyValueIndexSig;
}
