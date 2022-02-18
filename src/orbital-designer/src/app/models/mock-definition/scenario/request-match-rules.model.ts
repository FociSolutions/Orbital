import { BodyRule } from './body-rule.model';
import { KeyValueRule } from './key-value-rule.model';
import { UrlRule } from './url-rule.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRules {
  headerRules: KeyValueRule[];
  queryRules: KeyValueRule[];
  bodyRules: BodyRule[];
  urlRules: UrlRule[];
}

export const defaultRequestMatchRule: RequestMatchRules = {
  headerRules: [],
  queryRules: [],
  bodyRules: [],
  urlRules: [],
};
