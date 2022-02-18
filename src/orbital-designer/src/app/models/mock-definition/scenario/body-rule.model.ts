import { RuleType } from './rule-type';

/**
 * Model representation of body matching rule
 */
export interface BodyRule {
  type: RuleType;
  value: string;
}

export const defaultBodyRule: BodyRule = {
  type: RuleType.JSONCONTAINS,
  value: '',
};
