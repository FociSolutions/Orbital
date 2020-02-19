import { RuleType } from './rule.type';

/**
 * Model representation of body matching rule
 */
export interface BodyRule {
  type: RuleType;
  rule: object;
}

export const defaultBodyRule: BodyRule = {
  type: RuleType.NONE,
  rule: {}
};
