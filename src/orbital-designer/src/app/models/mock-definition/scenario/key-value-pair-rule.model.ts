import { KeyValue } from '@angular/common';
import { RuleType } from './rule.type';

/**
 * Model representation of KeyValue pair matching rule
 */
export interface KeyValuePairRule {
  type: RuleType;
  rule: KeyValue<string, string>;
}
