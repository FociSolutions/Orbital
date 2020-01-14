import { BodyRule } from './body-rule.model';
import { KeyValuePairType } from './key-value-pair-type.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRule {
  headerRules: KeyValuePairType[];
  queryRules: KeyValuePairType[];
  bodyRules: BodyRule[];
}
// <br/>
