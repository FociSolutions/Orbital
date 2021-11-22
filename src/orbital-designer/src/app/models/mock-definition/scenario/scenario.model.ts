import { RequestMatchRule, defaultRquestMatchRule } from './request-match-rule.model';
import { Metadata, defaultMetadata } from '../metadata.model';
import { VerbType } from '../../verb.type';
import { Response, defaultResponse } from './response.model';
import * as uuid from 'uuid';
import { Policy } from './policy.model';
import { defaultTokenRule, TokenRule } from './token-rule.model';
import { ValidationType } from '../token-validation.model';

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
  policies: Policy[];
  defaultScenario: boolean;
  tokenRule: TokenRule;
}

export const emptyScenario: Scenario = {
  id: uuid.v4(),
  metadata: defaultMetadata,
  verb: VerbType.GET,
  path: '',
  response: defaultResponse,
  requestMatchRules: defaultRquestMatchRule,
  policies: [],
  defaultScenario: false,
  tokenRule: defaultTokenRule
};

export interface ScenarioParams {
  title: string,
  description: string,
  path: string,
  verb: VerbType,
  status: number
}
