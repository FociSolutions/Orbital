import * as uuid from 'uuid';
import { RequestMatchRule } from './request-match-rule.model';
import { Metadata } from '../metadata.model';
import { VerbType } from '../../verb.type';
import { Response } from './response.model';
import { BodyRule } from './body-rule.model';
import { BodyRuleType } from './body-rule.type';

/**
 * Model representation of a scenario
 */
export interface Scenario {
  id: string;
  metadata: Metadata;
  verb: VerbType;
  path: string;
  response: Response;
  requestMatchRules: RequestMatchRule;
}

