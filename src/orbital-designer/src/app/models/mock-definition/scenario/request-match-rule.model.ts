import { BodyRule } from './body-rule.model';
import { KeyValuePairRule } from './key-value-pair-rule.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRule {
  headerRules: KeyValuePairRule[];
  queryRules: KeyValuePairRule[];
  bodyRules: BodyRule[];
  urlRules: KeyValuePairRule[];
}

export const defaultRquestMatchRule: RequestMatchRule = {
  headerRules: [],
  queryRules: [],
  bodyRules: [],
  urlRules: []
};
