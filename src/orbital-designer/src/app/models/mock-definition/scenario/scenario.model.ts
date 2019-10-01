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

/**
 * Given the verb and path of the endpoint the scenario is related to, this function
 * returns a scenario with default values.
 * @param verb The verb to use when creating the scenario
 * @param path The path to use when creating the scenario
 */
export function newScenario(verb: VerbType, path: string): Scenario {
  return {
    id: uuid.v4(),
    metadata: {
      title: 'New Scenario',
      description: ''
    },
    verb,
    path,
    response: {
      headers: new Map<string, string>(),
      status: 0,
      body: ''
    },
    requestMatchRules: {
      headerRules: new Map<string, string>(),
      queryRules: new Map<string, string>(),
      bodyRules: [] as Array<BodyRule>
    }
  };
}
