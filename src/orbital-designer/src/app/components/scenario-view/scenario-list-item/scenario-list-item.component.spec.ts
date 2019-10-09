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

describe('ScenarioListItemComponent', () => {
  let component: ScenarioListItemComponent;
  let fixture: ComponentFixture<ScenarioListItemComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListItemComponent, DialogBoxComponent],
      imports: [
        MatCardModule,
        LoggerTestingModule,
        MatMenuModule,
        MatIconModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListItemComponent);
    component = fixture.componentInstance;
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

  it('should delete a scenario from the store', () => {
    component.scenario = newScenario(VerbType.GET, '/test');
    const store = TestBed.get(DesignerStore);
    store.updateScenarios([component.scenario]);
    component.deleteScenario();
    expect(store.state.mockDefinition.scenarios).toEqual([]);
  });
});
