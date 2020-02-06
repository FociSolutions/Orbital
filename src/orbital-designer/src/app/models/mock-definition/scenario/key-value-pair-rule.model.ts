import { RuleType } from './rule.type';

/**
 * Model representation of KeyValue pair matching rule
 */
export interface KeyValuePairRule {
  type: RuleType;
  rule: Record<string, string>;
}

export const defaultHeaderMatchRule: KeyValuePairRule = {
  type: RuleType.NONE,
  rule: { '': '' }
};

export const defaultQueryMatchRule: KeyValuePairRule = {
  type: RuleType.NONE,
  rule: { '': '' }
};

export const defaultUrlMatchRule: KeyValuePairRule = {
  type: RuleType.NONE,
  rule: { urlPath: '' }
};
