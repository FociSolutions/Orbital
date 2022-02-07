import { RuleType } from './rule.type';

/**
 * Model representation of a Url matching rule
 */
export interface UrlRule {
  type: RuleType;
  path: string;
}
