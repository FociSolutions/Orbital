import { BodyRuleType } from './body-rule.type';

/**
 * Model representation of body matching rule
 */
export interface BodyRule {
  type: BodyRuleType;
  rule: object;
}
