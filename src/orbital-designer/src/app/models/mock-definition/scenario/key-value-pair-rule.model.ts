import { RuleType } from './rule.type';

/**
 * Model representation of KeyValue pair matching rule
 */
export interface KeyValuePairRule {
  type: RuleType;
  key: string;
  value: string;
}
