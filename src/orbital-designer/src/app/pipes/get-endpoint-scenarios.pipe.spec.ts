import { GetEndpointScenariosPipe } from './get-endpoint-scenarios.pipe';
import * as faker from 'faker';
import { VerbType } from '../models/verb.type';
import { newScenario } from '../models/mock-definition/scenario/scenario.model';

describe('GetEndpointScenariosPipe', () => {
  it('create an instance', () => {
    const pipe = new GetEndpointScenariosPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a filtered list of scenarios', () => {
    const pipe = new GetEndpointScenariosPipe();
    const mockPath = faker.internet.url();
    const mockVerb = faker.random.arrayElement([
      VerbType.GET,
      VerbType.DELETE,
      VerbType.PUT,
      VerbType.POST
    ]);
    const mockMatchingScenario = newScenario(mockVerb, mockPath);
    const mockNonMatchingScenario = newScenario(
      faker.random.arrayElement([
        VerbType.GET,
        VerbType.DELETE,
        VerbType.POST,
        VerbType.PUT
      ]),
      mockPath + faker.random.words()
    );
    const mockEndpoint = {
      path: mockPath,
      verb: mockVerb,
      spec: null
    };

    const results = pipe.transform(
      [mockMatchingScenario, mockNonMatchingScenario],
      mockEndpoint
    );

    expect(results).toEqual([mockMatchingScenario]);
  });

  it('should return an unfiltered list of scenarios if no endpoint is given', () => {
    const pipe = new GetEndpointScenariosPipe();
    const mockPath = faker.internet.url();
    const mockVerb = faker.random.arrayElement([
      VerbType.GET,
      VerbType.DELETE,
      VerbType.PUT,
      VerbType.POST
    ]);
    const mockMatchingScenario = newScenario(mockVerb, mockPath);
    const mockNonMatchingScenario = newScenario(
      faker.random.arrayElement([
        VerbType.GET,
        VerbType.DELETE,
        VerbType.POST,
        VerbType.PUT
      ]),
      mockPath + faker.random.words()
    );

    const results = pipe.transform(
      [mockMatchingScenario, mockNonMatchingScenario],
      null
    );

    expect(results).toEqual([mockMatchingScenario, mockNonMatchingScenario]);
  });
});
