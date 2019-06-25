import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioOverviewComponent } from './scenario-overview.component';

describe('ScenarioOverviewComponent', () => {
  let component: ScenarioOverviewComponent;
  let fixture: ComponentFixture<ScenarioOverviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioOverviewComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
