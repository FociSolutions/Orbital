import { TextRuleCondition } from '../rule-condition/text.condition';
import { BodyRuleType } from '../body-rule.type';

/**
 * Model representation of body matching rule
 */
export interface TextBodyRule {
  ruleType: BodyRuleType.TEXT;
  ruleCondition: TextRuleCondition;
  rule: Record<string, unknown>;
}

export const defaultTextBodyRule: TextBodyRule = {
  ruleType: BodyRuleType.TEXT,
  ruleCondition: TextRuleCondition.STARTS_WITH,
  rule: {},
};
