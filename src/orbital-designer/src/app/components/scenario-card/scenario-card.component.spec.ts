import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioCardComponent } from './scenario-card.component';
import { MatExpansionPanelTitle, MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ScenarioCardComponent', () => {
  let component: ScenarioCardComponent;
  let fixture: ComponentFixture<ScenarioCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ScenarioCardComponent ],
      imports: [ MatExpansionModule, BrowserAnimationsModule ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
