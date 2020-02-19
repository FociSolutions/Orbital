import {
  RequestMatchRule,
  defaultRquestMatchRule
} from './request-match-rule.model';
import { Metadata, defaultMetadata } from '../metadata.model';
import { VerbType } from '../../verb.type';
import { Response, defaultResponse } from './response.model';
import * as uuid from 'uuid';

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

export const defaultScenario: Scenario = {
  id: uuid.v4(),
  metadata: defaultMetadata,
  verb: VerbType.GET,
  path: '',
  response: defaultResponse,
  requestMatchRules: defaultRquestMatchRule
};
