import { RuleType } from './rule.type';

/**
 * Model representation of a url rule
 */
export interface URLRule {
  type: RuleType;
  rule: object;
}
