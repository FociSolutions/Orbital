import { BodyRule } from './body-rule.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRule {
  headerRules: Record<string, string>;
  queryRules: Record<string, string>;
  bodyRules: BodyRule[];
}
// <br/>
