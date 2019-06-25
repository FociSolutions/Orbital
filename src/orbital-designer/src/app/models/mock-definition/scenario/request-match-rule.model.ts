import { BodyRule } from './body-rule.model';

/**
 * Model representation of a request matching rule
 */
export interface RequestMatchRule {
  headerRules: Map<string, string>;
  queryRules: Map<string, string>;
  bodyRules: BodyRule[];
  response: Response;
}
// <br/>
