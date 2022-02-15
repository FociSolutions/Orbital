import { BodyRule } from './body-rule/body-rule.model';
import { KeyValuePairRule } from './key-value-pair-rule.model';
import { UrlRule } from './url-rule.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRule {
  headerRules: KeyValuePairRule[];
  queryRules: KeyValuePairRule[];
  bodyRules: BodyRule[];
  urlRules: UrlRule[];
}

export const defaultRequestMatchRule: RequestMatchRule = {
  headerRules: [],
  queryRules: [],
  bodyRules: [],
  urlRules: [],
};
