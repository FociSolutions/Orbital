import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { EditScenarioComponent } from './edit-scenario.component';
import { KeyValueListComponent } from './key-value-list/key-value-list.component';
import {
  newScenario,
  Scenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
import { VerbType } from 'src/app/models/verb.type';
import { AppStore } from 'src/app/store/app-store';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';

import { ToastrService, ToastrModule } from 'ngx-toastr';

describe('EditScenarioComponent', () => {
  let component: EditScenarioComponent;
  let fixture: ComponentFixture<EditScenarioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [ToastrModule.forRoot()],
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
