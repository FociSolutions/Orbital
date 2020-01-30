import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioViewComponent } from './scenario-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { OrbitalCommonModule } from '../orbital-common/orbital-common.module';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { SideBarComponent } from '../orbital-common/side-bar/side-bar.component';
import { MatCardModule } from '@angular/material/card';
import { OverviewHeaderComponent } from '../orbital-common/overview-header/overview-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material';
import { Router } from '@angular/router';
import { MatChipsModule } from '@angular/material/chips';
import { FormsModule } from '@angular/forms';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import * as faker from 'faker';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { VerbType } from 'src/app/models/verb.type';
import * as uuid from 'uuid';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { GetVerbStringPipe } from 'src/app/pipes/get-verb-string/get-verb-string.pipe';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioViewComponent,
        SideBarComponent,
        GetEndpointScenariosPipe,
        GetVerbColorPipe,
        GetVerbStringPipe,
        OverviewHeaderComponent
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        OrbitalCommonModule,
        RouterTestingModule,
        MatMenuModule,
        MatButtonModule,
        FormsModule,
        MatChipsModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(async () => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioViewComponent.addScenario', () => {
    it('should navigate to scenario editor', () => {
      const routerSpy = spyOn(TestBed.get(Router), 'navigateByUrl');
      component.addScenario();
      expect(routerSpy.calls.mostRecent().args[0]).toMatch(
        /\/scenario-editor\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
      );
    });
  });
  describe('ScenarioViewComponent.SearchBar', () => {
    describe('ScenarioViewComponent.scenarioToString', () => {
      it('should return the scenario title', () => {
        const newScenario: Scenario = {
          metadata: {
            title: faker.random.words()
          } as Metadata
        } as Scenario;

        component.scenarioList = [newScenario];

        const scenario = component.scenarioList[0];
        const expected = component.scenarioList[0].metadata.title;
        expect(expected).toEqual(component.scenarioToString(scenario));
      });
      it('should return undefined result', () => {
        const scenario = null;
        expect(component.scenarioToString(scenario)).toBeUndefined();
      });
    });
    describe('ScenarioViewComponent.setFilteredList', () => {
      it('should set the filteredList property to equal the given array', () => {
        const expected = component.scenarioList;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual(expected);
      });
      it('should set the filtered list to an empty list when the filtered list is null', () => {
        const expected = null;
        component.setFilteredList(expected);
        expect(component.filteredList).toEqual([]);
      });
    });
  });

  describe('ScenarioViewComponent.cloneScenario', () => {
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
          verb: mockverb,
          path,
          response: {
            headers: {},
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);

      expect(
        store.state.mockDefinition.scenarios.find(
          x => x.metadata.title.indexOf('-copy') !== -1
        )
      ).toBeTruthy();
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
          verb: mockverb,
          path,
          response: {
            headers: {},
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);
      component.cloneScenario(scenarios[0]);
      component.cloneScenario(scenarios[0]);

      expect(
        store.state.mockDefinition.scenarios.find(
          x => x.metadata.title.indexOf('-copy 2') !== -1
        )
      ).toBeTruthy();
      expect(
        store.state.mockDefinition.scenarios.find(
          x => x.metadata.title.indexOf('-copy 3') !== -1
        )
      ).toBeTruthy();
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
          verb: mockverb,
          path,
          response: {
            headers: {},
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      const scenarioLengthComponentExpected =
        store.state.mockDefinition.scenarios.length;
      component.cloneScenario(null);

      const scenarioLengthComponentActual =
        store.state.mockDefinition.scenarios.length;
      expect(scenarioLengthComponentActual).toEqual(
        scenarioLengthComponentExpected
      );
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
          verb: mockverb,
          path,
          response: {
            headers: {},
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;
      component.cloneScenario(scenarios[0]);

      expect(store.state.mockDefinition.scenarios[0].id).not.toEqual(
        store.state.mockDefinition.scenarios[1].id
      );
      expect(
        store.state.mockDefinition.scenarios[0].metadata.title
      ).not.toEqual(store.state.mockDefinition.scenarios[1].metadata.title);
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
          verb: mockverb,
          path,
          response: {
            headers: {},
            status: 0,
            body: ''
          },
          requestMatchRules: {
            headerRules: [],
            queryRules: [],
            bodyRules: [
              {
                type: RuleType.JSONEQUALITY,
                rule: {}
              }
            ] as Array<BodyRule>
          }
        } as Scenario;
        scenario.metadata.title = faker.random.words();
        scenarios.push(JSON.parse(JSON.stringify(scenario)));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);

      const componentScenarioClonee = store.state.mockDefinition.scenarios[0];

      // ensure that there are two results after the cloning operation
      const expectedResults = store.state.mockDefinition.scenarios.filter(
        aScenario =>
          aScenario.id !== componentScenarioClonee.id &&
          aScenario.metadata.title !== componentScenarioClonee.metadata.title &&
          aScenario.path === componentScenarioClonee.path &&
          JSON.stringify(aScenario.requestMatchRules.bodyRules) ===
            JSON.stringify(
              componentScenarioClonee.requestMatchRules.bodyRules
            ) &&
          JSON.stringify(aScenario.requestMatchRules.headerRules) ===
            JSON.stringify(
              componentScenarioClonee.requestMatchRules.headerRules
            ) &&
          JSON.stringify(aScenario.requestMatchRules.queryRules) ===
            JSON.stringify(
              componentScenarioClonee.requestMatchRules.queryRules
            ) &&
          aScenario.response.body === componentScenarioClonee.response.body &&
          JSON.stringify(aScenario.response.headers) ===
            JSON.stringify(componentScenarioClonee.response.headers) &&
          aScenario.response.status ===
            componentScenarioClonee.response.status &&
          JSON.stringify(aScenario.verb) ===
            JSON.stringify(componentScenarioClonee.verb) &&
          aScenario.metadata.description ===
            componentScenarioClonee.metadata.description
      ).length;

      expect(expectedResults).toEqual(1);
    });
  });

  describe('ScenarioViewComponent.deleteScenario', () => {
    it('should set the triggerOpen to scenarioId', () => {
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
          headers: {},
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: [],
          queryRules: [],
          bodyRules: [
            {
              type: RuleType.JSONEQUALITY,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;

      component.confirmDeleteDialog(scenario);
      expect(component.triggerOpen).toEqual(scenario.id);
    });
  });

  describe('ScenarioViewComponent.showDialog', () => {
    it('should set the triggerOpen to scenarioId', () => {
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
          headers: {},
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: [],
          queryRules: [],
          bodyRules: [
            {
              type: RuleType.JSONEQUALITY,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;

      component.showDialog(scenario);
      component.confirmDeleteDialog(scenario);
      expect(component.triggerOpen).toBeTruthy();
    });
  });

  it('should return Not Found for a 404 status', () => {
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
        headers: {},
        status: 0,
        body: ''
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            rule: {}
          }
        ] as Array<BodyRule>
      }
    } as Scenario;
    scenario.response.status = 404;
    expect(component.getScenarioResponseStatusString(scenario)).toBe(
      'Not Found'
    );
  });

  it('should return Accepted for a 202 status', () => {
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
        headers: {},
        status: 0,
        body: ''
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [
          {
            type: RuleType.JSONEQUALITY,
            rule: {}
          }
        ] as Array<BodyRule>
      }
    } as Scenario;
    scenario.response.status = 202;
    expect(component.getScenarioResponseStatusString(scenario)).toBe(
      'Accepted'
    );
  });

  describe('ScenarioListItemComponent.deleteScenario', () => {
    it('should delete a scenario from the store', () => {
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
          headers: {},
          status: 0,
          body: ''
        },
        requestMatchRules: {
          headerRules: [],
          queryRules: [],
          bodyRules: [
            {
              type: RuleType.JSONEQUALITY,
              rule: {}
            }
          ] as Array<BodyRule>
        }
      } as Scenario;
      store.updateScenarios([scenario]);
      component.deleteScenario(scenario);
      expect(store.state.mockDefinition.scenarios).toEqual([]);
    });
  });
});
