import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioViewComponent } from './scenario-view.component';

describe('ScenarioViewComponent', () => {
  let component: ScenarioViewComponent;
  let fixture: ComponentFixture<ScenarioViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
