import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ScenarioViewComponent } from './scenario-view.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { SharedModule } from '../../shared/shared.module';
import { GetEndpointScenariosPipe } from 'src/app/pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color/get-verb-color.pipe';
import { SideBarComponent } from '../../shared/components/side-bar/side-bar.component';
import { MatLegacyCardModule as MatCardModule } from '@angular/material/legacy-card';
import { OverviewHeaderComponent } from '../../shared/components/overview-header/overview-header.component';
import { RouterTestingModule } from '@angular/router/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { MatLegacyChipsModule as MatChipsModule } from '@angular/material/legacy-chips';
import { FormsModule } from '@angular/forms';
import { Scenario, ScenarioParams } from 'src/app/models/mock-definition/scenario/scenario.model';
import { faker } from '@faker-js/faker';
import { VerbType } from 'src/app/models/verb-type';
import validMockDefinition from '../../../test-files/test-mockdefinition-object';
import { GetVerbStringPipe } from 'src/app/pipes/get-verb-string/get-verb-string.pipe';
import { ScenarioEditorComponent } from '../scenario-editor/scenario-editor.component';
import { MetadataFormComponent } from '../scenario-editor/metadata-form/metadata-form.component';
import { ResponseFormComponent } from '../scenario-editor/response-form/response-form.component';
import { PoliciesFormComponent } from '../scenario-editor/policies-form/policies-form.component';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { ValidationType } from 'src/app/models/mock-definition/scenario/token-rule.model';
import { MatTabsModule } from '@angular/material/tabs';
import { cloneDeep } from 'lodash';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;
  let store: DesignerStore;
  let mockDefService: MockDefinitionService;

  const scenarioParams: ScenarioParams = {
    path: '/test',
    verb: VerbType.GET,
    description: '',
    title: 'New Scenario',
    status: 0,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        MetadataFormComponent,
        ResponseFormComponent,
        GetEndpointScenariosPipe,
        GetRuleTypeStringPipe,
        GetVerbColorPipe,
        GetVerbStringPipe,
        OverviewHeaderComponent,
        PoliciesFormComponent,
        ScenarioEditorComponent,
        ScenarioViewComponent,
        SideBarComponent,
      ],
      imports: [
        LoggerTestingModule,
        MatCardModule,
        SharedModule,
        RouterTestingModule.withRoutes([{ path: 'scenario-editor/:scenarioId', component: ScenarioEditorComponent }]),
        MatMenuModule,
        MatButtonModule,
        MatTabsModule,
        FormsModule,
        MatChipsModule,
        BrowserAnimationsModule,
      ],
      providers: [DesignerStore],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
    store = TestBed.inject(DesignerStore);
    store.mockDefinition = validMockDefinition;
    mockDefService = TestBed.inject(MockDefinitionService);
    tick();
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioViewComponent.addScenario', () => {
    // it('should navigate to scenario editor', fakeAsync(() => {
    //   fixture.ngZone.run(() => {
    //     const routerSpy = jest.spyOn(TestBed.inject(Router), 'navigateByUrl');
    //     component.addScenario();
    //     fixture.detectChanges();
    //     tick();
    //     expect(routerSpy.calls.mostRecent().args[0]).toMatch(
    //       /\/scenario-editor\/[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i
    //     );
    //   });
    // }));
  });
  describe('ScenarioViewComponent.SearchBar', () => {
    describe('ScenarioViewComponent.scenarioToString', () => {
      it('should return the scenario title', () => {
        const newScenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

        component.scenarioList = [newScenario];

        const scenario = component.scenarioList[0];
        const expected = component.scenarioList[0].metadata.title;
        const actual = component.scenarioToString(scenario);
        expect(actual).toEqual(expected);
      });
      it('should return empty result', () => {
        const scenario = null;
        expect(component.scenarioToString(scenario)).toEqual('');
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
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);

      expect(store.state.mockDefinition.scenarios.find((x) => x.metadata.title.includes('-copy'))).toBeTruthy();
    });

    it('should clone a scenario from the store such that name conflicts will be encountered and will auto-rename', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);
      component.cloneScenario(scenarios[0]);
      component.cloneScenario(scenarios[0]);

      expect(store.state.mockDefinition.scenarios.find((x) => x.metadata.title.includes('-copy 2'))).toBeTruthy();
      expect(store.state.mockDefinition.scenarios.find((x) => x.metadata.title.includes('-copy 3'))).toBeTruthy();
    });

    it('should not clone a scenario from the store if the cloned scenario is invalid', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;

      const scenarioLengthComponentExpected = store.state.mockDefinition.scenarios.length;
      component.cloneScenario(null);

      const scenarioLengthComponentActual = store.state.mockDefinition.scenarios.length;
      expect(scenarioLengthComponentActual).toEqual(scenarioLengthComponentExpected);
    });

    it('should clone a scenario and ensure that the title and id are different', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;
      component.cloneScenario(scenarios[0]);

      expect(store.state.mockDefinition.scenarios[0].id).not.toEqual(store.state.mockDefinition.scenarios[1].id);
      expect(store.state.mockDefinition.scenarios[0].metadata.title).not.toEqual(
        store.state.mockDefinition.scenarios[1].metadata.title
      );
    });

    it('should clone a scenario and ensure that there exists another scenario with the same contents, except for title and id', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 3; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenario.path = `/${faker.random.words()}`;
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);

      const componentScenarioClone = store.state.mockDefinition.scenarios[0];

      // ensure that there are two results after the cloning operation
      const expectedResults = store.state.mockDefinition.scenarios.filter(
        (aScenario) =>
          aScenario.id !== componentScenarioClone.id &&
          aScenario.metadata.title !== componentScenarioClone.metadata.title &&
          aScenario.path === componentScenarioClone.path &&
          JSON.stringify(aScenario.requestMatchRules.bodyRules) ===
            JSON.stringify(componentScenarioClone.requestMatchRules.bodyRules) &&
          JSON.stringify(aScenario.requestMatchRules.headerRules) ===
            JSON.stringify(componentScenarioClone.requestMatchRules.headerRules) &&
          JSON.stringify(aScenario.requestMatchRules.queryRules) ===
            JSON.stringify(componentScenarioClone.requestMatchRules.queryRules) &&
          aScenario.response.body === componentScenarioClone.response.body &&
          JSON.stringify(aScenario.response.headers) === JSON.stringify(componentScenarioClone.response.headers) &&
          aScenario.response.status === componentScenarioClone.response.status &&
          JSON.stringify(aScenario.verb) === JSON.stringify(componentScenarioClone.verb) &&
          aScenario.metadata.description === componentScenarioClone.metadata.description
      );

      expect(expectedResults.length).toEqual(1);
    });

    it('should clone a scenario from the store and the defaultScenario property should be false', () => {
      const scenarios: Scenario[] = [];
      for (let i = 0; i < 10; i++) {
        const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
        scenario.metadata.title = faker.random.words();
        scenarios.push(cloneDeep(scenario));
      }

      store.state.mockDefinition.scenarios = scenarios;

      component.cloneScenario(scenarios[0]);

      expect(store.state.mockDefinition.scenarios[1].defaultScenario).toBe(false);
    });
  });

  describe('ScenarioViewComponent.deleteScenario', () => {
    it('should set the triggerOpen to scenarioId', () => {
      const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

      component.confirmDeleteDialog(scenario);
      expect(component.triggerOpen).toEqual(scenario.id);
    });
  });

  describe('ScenarioViewComponent.showDialog', () => {
    it('should set the triggerOpen to scenarioId', () => {
      const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

      component.showDialog(scenario);
      component.confirmDeleteDialog(scenario);
      expect(component.triggerOpen).toBeTruthy();
    });
  });

  it('should return Not Found for a 404 status', () => {
    const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

    scenario.response.status = 404;
    expect(component.getScenarioResponseStatusString(scenario)).toBe('Not Found');
  });

  it('should return Accepted for a 202 status', () => {
    const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

    scenario.response.status = 202;
    expect(component.getScenarioResponseStatusString(scenario)).toBe('Accepted');
  });

  describe('ScenarioListItemComponent.deleteScenario', () => {
    it('should delete a scenario from the store', () => {
      const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);

      store.updateScenarios([scenario]);
      component.deleteScenario(scenario);
      expect(store.state.mockDefinition.scenarios).toEqual([]);
    });
  });

  describe('ScenarioListItemComponent.updateScenariosValidationType', () => {
    it('should update the validation type variable on the mock def(s) in the list', () => {
      const scenario: Scenario = mockDefService.generateNewScenario(scenarioParams);
      component.scenarioList.push(scenario);
      component.updateScenariosValidationType(2);

      expect(component.scenarioList[0].tokenRule.validationType).toEqual(
        ValidationType.JWT_VALIDATION_AND_REQUEST_MATCH
      );
    });
  });
});
