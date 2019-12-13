import { TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import * as uuid from 'uuid';
import { MockDefinitionService } from './mock-definition.service';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import validMockDefinitionFile from '../../../test-files/test-mockdefinition-file.mock';
import { DesignerStore } from './../../store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { VerbType } from 'src/app/models/verb.type';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';

describe('MockDefinitionService', () => {
  let store: DesignerStore;
  beforeEach(() => TestBed.configureTestingModule({
    imports: [
      LoggerTestingModule
    ],
    providers: [DesignerStore, MockDefinitionService]}).compileComponents());
  beforeEach(() => {
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition as MockDefinition;

  });

  it('should be created', () => {
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);
    expect(service).toBeTruthy();
  });

  it('should clone a scenario from the store such that no name conflicts will be encountered', () => {
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      const mockverb = VerbType.GET;
      const path = '/test';
      const scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: ''
        },
        verb: mockverb,
        path,
        response: {
          headers: new Map<string, string>(),
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: new Map<string, string>(),
          queryRules: new Map<string, string>(),
          bodyRules: [
            {
              type: BodyRuleType.BodyEquality,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;

      scenario.metadata.title = faker.random.words();
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }
    store.state.mockDefinition.scenarios = scenarios;

    const scenarioToClone = JSON.parse(JSON.stringify(scenarios[0]));
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: r => {
        expect(store.state.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy') !== -1)).toBeTruthy();
      }
    }
    );
  });

  it('should clone a scenario from the store such that name conflicts will be encountered and will auto-rename', () => {
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);
    const scenarios = [];
    for (let i = 0; i < 10; i++) {
      const mockverb = VerbType.GET;
      const path = '/test';
      const scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: ''
        },
        verb: mockverb,
        path,
        response: {
          headers: new Map<string, string>(),
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: new Map<string, string>(),
          queryRules: new Map<string, string>(),
          bodyRules: [
            {
              type: BodyRuleType.BodyEquality,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;
      scenario.metadata.title = faker.random.words();
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;

    const scenarioToClone = JSON.parse(JSON.stringify(scenarios[0]));

    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe();

    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: r => {
        expect(store.state.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy 2') !== -1)).toBeTruthy();
      }
    }
    );
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: r => {
        expect(store.state.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy 3') !== -1)).toBeTruthy();
      }
    }
    );
  });

  it('should not clone a scenario from the store if the cloned scenario is invalid', () => {
    const scenarios = [];
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);
    for (let i = 0; i < 10; i++) {
      const mockverb = VerbType.GET;
      const path = '/test';
      const scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: ''
        },
        verb: mockverb,
        path,
        response: {
          headers: new Map<string, string>(),
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: new Map<string, string>(),
          queryRules: new Map<string, string>(),
          bodyRules: [
            {
              type: BodyRuleType.BodyEquality,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;
      scenario.metadata.title = faker.random.words();
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;

    const scenarioLengthComponentExpected = store.state.mockDefinition.scenarios.length;
    const scenarioToClone = null;
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      error: r => {
        const scenarioLengthComponentActual = store.state.mockDefinition.scenarios.length;
        expect(scenarioLengthComponentActual).toEqual(scenarioLengthComponentExpected);
      }
    }
    );
  });

  it('should clone a scenario and ensure that the title and id are different', () => {
    const scenarios = [];
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);
    for (let i = 0; i < 10; i++) {
      const mockverb = VerbType.GET;
      const path = '/test';
      const scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: ''
        },
        verb: mockverb,
        path,
        response: {
          headers: new Map<string, string>(),
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: new Map<string, string>(),
          queryRules: new Map<string, string>(),
          bodyRules: [
            {
              type: BodyRuleType.BodyEquality,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;
      scenario.metadata.title = faker.random.words();
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;
    const scenarioToClone = scenarios[0];
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: r => {
        expect(store.state.mockDefinition.scenarios[0].id).not.toEqual(store.mockDefinition.scenarios[1].id);
        expect(store.state.mockDefinition.scenarios[0].metadata.title).not.toEqual(store.mockDefinition.scenarios[1].metadata.title);
      }
    }
    );
  });


  it('should clone a scenario and ensure that there exists another scenario with the same contents, except for title and id', () => {
    const scenarios = [];
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);

    for (let i = 0; i < 3; i++) {
      const mockverb = VerbType.GET;
      const path = '/' + faker.random.words();
      const scenario = {
        id: uuid.v4(),
        metadata: {
          title: 'New Scenario',
          description: ''
        },
        verb: mockverb,
        path,
        response: {
          headers: new Map<string, string>(),
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: new Map<string, string>(),
          queryRules: new Map<string, string>(),
          bodyRules: [
            {
              type: BodyRuleType.BodyEquality,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;
      scenario.metadata.title = faker.random.words();
      scenarios.push(JSON.parse(JSON.stringify(scenario)));
    }

    store.state.mockDefinition.scenarios = scenarios;

    const scenarioToClone = scenarios[0];
    service.cloneScenario(validMockDefinition.metadata.title, scenarioToClone).subscribe({
      next: n => {
        console.log(n);
      }
    });
    const componentScenarioClonee = store.state.mockDefinition.scenarios[0];

    // ensure that there are two results after the cloning operation
    const expectedResults = (store.state.mockDefinition.scenarios.filter(aScenario =>
      aScenario.id !== componentScenarioClonee.id &&
      aScenario.metadata.title !== componentScenarioClonee.metadata.title &&
      aScenario.path === componentScenarioClonee.path &&
      JSON.stringify(aScenario.requestMatchRules.bodyRules) ===
        JSON.stringify(componentScenarioClonee.requestMatchRules.bodyRules) &&
        JSON.stringify(aScenario.requestMatchRules.headerRules) ===
      JSON.stringify(componentScenarioClonee.requestMatchRules.headerRules) &&
        JSON.stringify(aScenario.requestMatchRules.queryRules) ===
      JSON.stringify(componentScenarioClonee.requestMatchRules.queryRules) &&
      aScenario.response.body === componentScenarioClonee.response.body &&
      JSON.stringify(aScenario.response.headers) === JSON.stringify(componentScenarioClonee.response.headers) &&
      aScenario.response.status === componentScenarioClonee.response.status &&
      JSON.stringify(aScenario.verb) === JSON.stringify(componentScenarioClonee.verb) &&
      aScenario.metadata.description === componentScenarioClonee.metadata.description)).length;

    expect(expectedResults).toEqual(1);
  });

  it('failed because content is not yaml', done => {
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);

    service.deserialize('%').subscribe({
      error: (err) => {
        expect(err).toBeTruthy();
        done();
      }
    }
    );
  });

  it('succeed because content is valid yaml', done => {
    const service: MockDefinitionService = TestBed.get(MockDefinitionService);

    service.deserialize(validMockDefinitionFile).subscribe({
      next: t => {
        expect(t).toBeTruthy();
        done();
      }
    }
    );
  });
});
