import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioListItemComponent } from './scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { DesignerStore } from './../../../store/designer-store';
import { newScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { VerbType } from 'src/app/models/verb.type';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import * as faker from 'faker';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';

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
    component.scenario = newScenario(VerbType.GET, '/test');
    component.scenario.response.status = 404;
    expect(component.getScenarioResponseStatusString()).toBe('Not Found');
  });

  it('should return Accepted for a 202 status', () => {
    component.scenario = newScenario(VerbType.GET, '/test');
    component.scenario.response.status = 202;
    expect(component.getScenarioResponseStatusString()).toBe('Accepted');
  });

  describe('ScenarioListItemComponent.deleteScenario', () => {
    it('should delete a scenario from the store', () => {
      component.scenario = newScenario(VerbType.GET, '/test');
      store.updateScenarios([component.scenario]);
      component.deleteScenario();
      expect(store.state.mockDefinition.scenarios).toEqual([]);
    });
  });

  describe('ScenarioListItemComponent.cloneScenario', () => {
    it('should clone a scenario from the store such that no name conflicts will be encountered', () => {
      const scenarios = [];
      for (let i = 0; i < 10; i++) {
        const scenario = newScenario(VerbType.GET, '/test');
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
        const scenario = newScenario(VerbType.GET, '/test');
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
        const scenario = newScenario(VerbType.GET, '/test');
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
        const scenario = newScenario(VerbType.GET, '/test');
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
        const scenario = newScenario(VerbType.GET, '/' + faker.random.words());
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
