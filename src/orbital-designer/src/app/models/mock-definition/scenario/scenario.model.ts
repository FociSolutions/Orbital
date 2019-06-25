import { RequestMatchRule } from './request-match-rule.model';

/**
 * Model representation of a scenario
 */
export interface Scenario {
  verb: string;
  path: string;
  requestMatchRules: RequestMatchRule[];
}
