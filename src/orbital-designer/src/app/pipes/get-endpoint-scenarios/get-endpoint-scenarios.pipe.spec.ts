import { GetEndpointScenariosPipe } from './get-endpoint-scenarios.pipe';
import * as faker from 'faker';
import { VerbType } from '../../models/verb-type';
import { Scenario } from '../../models/mock-definition/scenario/scenario.model';
import * as uuid from 'uuid';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule-type';

describe('GetEndpointScenariosPipe', () => {
  it('create an instance', () => {
    const pipe = new GetEndpointScenariosPipe();
    expect(pipe).toBeTruthy();
  });

  it('should return a filtered list of scenarios', () => {
    const pipe = new GetEndpointScenariosPipe();
    const mockPath = faker.internet.url();
    const mockVerb = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
    const mockMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerb,
      path: mockPath,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONCONTAINS,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;
    const mockpaths = mockPath + faker.random.words();
    const mockVerbs = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
    const mockNonMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerbs,
      path: mockpaths,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;
    const mockEndpoint = {
      path: mockPath,
      verb: mockVerb,
      spec: null,
    };

    const results = pipe.transform([mockMatchingScenario, mockNonMatchingScenario], mockEndpoint);

    expect(results).toEqual([mockMatchingScenario]);
  });

  it('should return a filtered list of scenarios ignoring verb case', () => {
    const pipe = new GetEndpointScenariosPipe();
    const mockPath = faker.internet.url();
    const mockVerb = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
    const mockMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerb,
      path: mockPath,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;
    const mockpaths = (mockPath + faker.random.words()) as string;
    const mockVerbs = faker.datatype.number({ min: 0, max: 3 });
    const mockNonMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerbs,
      path: mockpaths,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;
    const mockEndpoint = {
      path: mockPath,
      verb: mockVerb,
      spec: null,
    };

    const results = pipe.transform([mockMatchingScenario, mockNonMatchingScenario], mockEndpoint);

    expect(results).toEqual([mockMatchingScenario]);
  });

  it('should return an unfiltered list of scenarios if no endpoint is given', () => {
    const pipe = new GetEndpointScenariosPipe();
    const mockPath = faker.internet.url();
    const mockVerb = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
    const mockMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerb,
      path: mockPath,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;
    const mockpaths = mockPath + faker.random.words();
    const mockVerbs = faker.random.arrayElement([VerbType.GET, VerbType.DELETE, VerbType.PUT, VerbType.POST]);
    const mockNonMatchingScenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: '',
      },
      verb: mockVerbs,
      path: mockpaths,
      response: {
        headers: {},
        status: 0,
        body: '',
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            value: '{}',
          },
        ] as Array<BodyRule>,
      },
      defaultScenario: false,
    } as Scenario;

    const results = pipe.transform([mockMatchingScenario, mockNonMatchingScenario], null);

    expect(results).toEqual([mockMatchingScenario, mockNonMatchingScenario]);
  });
});
