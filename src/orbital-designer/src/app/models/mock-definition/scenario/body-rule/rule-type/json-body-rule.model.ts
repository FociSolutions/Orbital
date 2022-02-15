import { BodyRuleType } from '../body-rule.type';
import { JsonRuleCondition } from '../rule-condition/json.condition';

/**
 * Model representation of body matching rule
 */
export interface JsonBodyRule {
  ruleType: BodyRuleType.JSON;
  ruleCondition: JsonRuleCondition;
  rule: Record<string, unknown>;
}

export const defaultJsonBodyRule: JsonBodyRule = {
  ruleType: BodyRuleType.JSON,
  ruleCondition: JsonRuleCondition.CONTAINS,
  rule: {},
};
