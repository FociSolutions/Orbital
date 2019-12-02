import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioListItemComponent } from './scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { DesignerStore } from './../../../store/designer-store';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { RouterTestingModule } from '@angular/router/testing';
import { VerbType } from 'src/app/models/verb.type';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import * as uuid from 'uuid';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import * as faker from 'faker';

describe('ScenarioListItemComponent', () => {
  let component: ScenarioListItemComponent;
  let fixture: ComponentFixture<ScenarioListItemComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListItemComponent, DialogBoxComponent],
      imports: [
        MatCardModule,
        LoggerTestingModule,
        MatMenuModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListItemComponent);
    component = fixture.componentInstance;
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return Not Found for a 404 status', () => {
     const mockverb = VerbType.GET;
     const path = '/test';
     component.scenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: ''
      },
      mockverb,
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
    } as unknown as Scenario;
     component.scenario.response.status = 404;
     expect(component.getScenarioResponseStatusString()).toBe('Not Found');
  });

  it('should return Accepted for a 202 status', () => {
    const mockverb = VerbType.GET;
    const path = '/test';
    component.scenario = {
     id: uuid.v4(),
     metadata: {
       title: 'New Scenario',
       description: ''
     },
     mockverb,
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
   } as unknown as Scenario;
    component.scenario.response.status = 202;
    expect(component.getScenarioResponseStatusString()).toBe('Accepted');
  });

  describe('ScenarioListItemComponent.deleteScenario', () => {
    it('should delete a scenario from the store', () => {
      const mockverb = VerbType.GET;
      const path = '/test';
      component.scenario = {
       id: uuid.v4(),
       metadata: {
         title: 'New Scenario',
         description: ''
       },
       mockverb,
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
     } as unknown as Scenario;
      store.updateScenarios([component.scenario]);
      component.deleteScenario();
      expect(store.state.mockDefinition.scenarios).toEqual([]);
    });
  });

  describe('ScenarioListItemComponent.cloneScenario', () => {
    it('should clone a scenario from the store such that no name conflicts will be encountered', () => {
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
         mockverb,
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
       } as unknown as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.scenario = JSON.parse(JSON.stringify(scenarios[0]));
      component.cloneScenario();

      expect(component.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy') !== -1)).toBeTruthy();
    });

    it('should clone a scenario from the store such that name conflicts will be encountered and will auto-rename', () => {
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
         mockverb,
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
       } as unknown as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.scenario = JSON.parse(JSON.stringify(scenarios[0]));
      component.cloneScenario();
      component.cloneScenario();
      component.cloneScenario();

      expect(component.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy 2') !== -1)).toBeTruthy();
      expect(component.mockDefinition.scenarios.find(x => x.metadata.title.indexOf('-copy 3') !== -1)).toBeTruthy();
    });

    it('should not clone a scenario from the store if the cloned scenario is invalid', () => {
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
         mockverb,
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
       } as unknown as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      const scenarioLengthComponentExpected = component.mockDefinition.scenarios.length;
      component.scenario = null;
      component.cloneScenario();

      const scenarioLengthComponentActual = component.mockDefinition.scenarios.length;
      expect(scenarioLengthComponentActual).toEqual(scenarioLengthComponentExpected);
    });

    it('should clone a scenario and ensure that the title and id are different', () => {
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
         mockverb,
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
       } as unknown as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;
      component.scenario = scenarios[0];
      component.cloneScenario();

      expect(component.mockDefinition.scenarios[0].id).not.toEqual(component.mockDefinition.scenarios[1].id);
      expect(component.mockDefinition.scenarios[0].metadata.title).not.toEqual(component.mockDefinition.scenarios[1].metadata.title);
    });

    it('should clone a scenario and ensure that there exists another scenario with the same contents, except for title and id', () => {
      const scenarios = [];
      for (let i = 0; i < 3; i++) {
        const mockverb = VerbType.GET;
        const path = '/' + faker.random.words();
        const scenario = {
         id: uuid.v4(),
         metadata: {
           title: 'New Scenario',
           description: ''
         },
         mockverb,
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
       } as unknown as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.scenario = JSON.parse(JSON.stringify(scenarios[0]));
      component.cloneScenario();

      const componentScenarioClonee = component.mockDefinition.scenarios[0];

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
  });
});
