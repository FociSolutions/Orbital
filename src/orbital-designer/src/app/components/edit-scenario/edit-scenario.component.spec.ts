import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditScenarioComponent } from './edit-scenario.component';
import { KeyValueListComponent } from './key-value-list/key-value-list.component';
import { newScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { VerbType } from 'src/app/models/verb.type';
import { AppStore } from 'src/app/store/app-store';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import * as faker from 'faker';

import { ToastrService, ToastrModule } from 'ngx-toastr';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { componentFactoryName } from '@angular/compiler';

describe('EditScenarioComponent', () => {
  let component: EditScenarioComponent;
  let fixture: ComponentFixture<EditScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ToastrModule.forRoot()],
      declarations: [EditScenarioComponent, KeyValueListComponent],
      providers: [AppStore, MockDefinitionStore, ToastrService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScenarioComponent);
    component = fixture.componentInstance;
    component.scenarioInput = newScenario(VerbType.GET, '/pets');
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set internal scenario state', () => {
    const mockScenario = newScenario(VerbType.GET, '/pets');
    component.scenarioInput = mockScenario;
    expect(component.scenario).toEqual(mockScenario);
  });

  it('should save the scenario to the mock definition store', () => {
    const mockDefinitionStore = TestBed.get(MockDefinitionStore);
    component.onSave();
    expect(mockDefinitionStore.state.scenarios).toEqual([component.scenario]);
  });

  it('should output the components scenario on delete', () => {
    const mockDefinitionStore = TestBed.get(MockDefinitionStore);
    mockDefinitionStore.updateScenarios([component.scenario]);
    expect(mockDefinitionStore.state.scenarios).toEqual([component.scenario]);
    component.onDelete();
    expect(mockDefinitionStore.state.scenarios).toEqual([]);
  });

  it('should set showEditor to false and reset the selectedScenario', () => {
    const appStore: AppStore = TestBed.get(AppStore);
    appStore.selectedScenario = component.scenario;
    expect(appStore.state.selectedScenario).toEqual(component.scenario);
    component.onCancel();
    expect(appStore.selectedScenario).toBeFalsy();
    expect(appStore.showEditor).toBeFalsy();
  });
});

describe('EditScenarioComponent.onBodyRuleEdit', () => {
  let component: EditScenarioComponent;
  let fixture: ComponentFixture<EditScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [BrowserAnimationsModule, ToastrModule.forRoot()],
      declarations: [EditScenarioComponent, KeyValueListComponent],
      providers: [AppStore, MockDefinitionStore, ToastrService]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditScenarioComponent);
    component = fixture.componentInstance;
    component.scenarioInput = newScenario(VerbType.GET, '/pets');
    fixture.detectChanges();
  });

  it('Should update body rule object when given valid JSON string', () => {
    const expectedObj = new Object();
    for (let x = 0; x < 10; x++) {
      expectedObj[faker.random.word()] = faker.random.words();
    }
    component.onBodyRuleEdit(JSON.stringify(expectedObj));
    expect(component.scenario.requestMatchRules.bodyRules[0].rule).toEqual(
      expectedObj
    );
  });

  it('Should not update the body rule object when given an invalid JSON string', () => {
    const expectedObj = new Object();
    for (let x = 0; x < 10; x++) {
      expectedObj[faker.random.word()] = faker.random.words();
    }
    component.onBodyRuleEdit(JSON.stringify(expectedObj));
    expect(component.scenario.requestMatchRules.bodyRules[0].rule).toEqual(
      expectedObj
    );
    component.onBodyRuleEdit('{Invalid Json string');
    expect(component.scenario.requestMatchRules.bodyRules[0].rule).toEqual(
      expectedObj
    );
  });
});
