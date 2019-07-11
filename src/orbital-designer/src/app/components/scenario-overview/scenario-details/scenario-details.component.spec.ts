import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { VerbType } from '../../../models/verb.type';
import * as faker from 'faker';

import { ScenarioDetailsComponent } from './scenario-details.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { GetVerbColorPipe } from 'src/app/pipes/get-verb-color.pipe';
import { newScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';

describe('ScenarioDetailsComponent', () => {
  let component: ScenarioDetailsComponent;
  let fixture: ComponentFixture<ScenarioDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioDetailsComponent, GetVerbColorPipe],
      providers: [AppStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioDetailsComponent);
    component = fixture.componentInstance;
    component.scenario = newScenario(
      faker.random.arrayElement([
        VerbType.GET,
        VerbType.DELETE,
        VerbType.POST,
        VerbType.PUT
      ]),
      faker.internet.domainSuffix()
    );
    TestBed.get<AppStore>(AppStore).selectedScenario = newScenario(
      faker.random.arrayElement([
        VerbType.GET,
        VerbType.DELETE,
        VerbType.POST,
        VerbType.PUT
      ]),
      faker.internet.domainSuffix()
    );
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should set the selectedScenario property in the app store', () => {
    const appStore: AppStore = TestBed.get(AppStore);
    component.onSelect();
    expect(appStore.state.selectedScenario).toEqual(component.scenario);
  });
});
