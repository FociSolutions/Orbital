import { GetEndpointScenariosPipe } from './get-endpoint-scenarios.pipe';
import * as faker from 'faker';
import { VerbType } from '../../models/verb-type';
import { Scenario } from '../../models/mock-definition/scenario/scenario.model';
import * as uuid from 'uuid';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import { cloneDeep } from 'lodash';
import { ValidationType } from 'src/app/models/mock-definition/scenario/token-rule.model';
import { Endpoint } from 'src/app/models/endpoint.model';
import { OpenAPIV2 } from 'openapi-types';

describe('GetEndpointScenariosPipe', () => {
  const mockPath = faker.internet.url();
  const mockVerb = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
  const BASE_SCENARIO: Scenario = {
    id: uuid.v4(),
    metadata: { title: 'New Scenario', description: '' },
    verb: mockVerb,
    path: mockPath,
    response: { type: ResponseType.CUSTOM, headers: {}, status: 0, body: '' },
    requestMatchRules: { headerRules: [], queryRules: [], bodyRules: [], urlRules: [] },
    tokenRule: { validationType: ValidationType.NONE, rules: [] },
    policies: [],
    defaultScenario: false,
  };

  it('create an instance', () => {
    const pipe = new GetEndpointScenariosPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a filtered list of scenarios', () => {
    const pipe = new GetEndpointScenariosPipe();
    const altScenario: Scenario = cloneDeep(BASE_SCENARIO);
    altScenario.path = mockPath + faker.random.words();
    altScenario.verb = faker.random.arrayElement([VerbType.OPTIONS, VerbType.HEAD, VerbType.PATCH]);

    const mockEndpoint: Endpoint = {
      path: mockPath,
      verb: mockVerb,
      spec: {} as OpenAPIV2.OperationObject,
    };

    const actual = pipe.transform([BASE_SCENARIO, altScenario], mockEndpoint);
    const expected = [BASE_SCENARIO];

    expect(actual).toEqual(expected);
  });

  it('should return an unfiltered list of scenarios if no endpoint is given', () => {
    const pipe = new GetEndpointScenariosPipe();
    const altScenario: Scenario = cloneDeep(BASE_SCENARIO);
    altScenario.path = mockPath + faker.random.words();
    altScenario.verb = faker.random.arrayElement([VerbType.OPTIONS, VerbType.HEAD, VerbType.PATCH]);

    const expected = [BASE_SCENARIO, altScenario];
    const actual = pipe.transform(expected, null);

    expect(actual).toEqual(expected);
  });
});
