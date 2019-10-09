import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioCardComponent } from './scenario-card.component';
import { MatExpansionModule } from '@angular/material';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ScenarioCardComponent', () => {
  let component: ScenarioCardComponent;
  let fixture: ComponentFixture<ScenarioCardComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioCardComponent],
      imports: [MatExpansionModule, BrowserAnimationsModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('ScenarioCardComponent.handlePanelOpen and handlePanelClose', () => {
    it('should expand panel when the panel expands', () => {
      spyOn(component, 'handlePanelOpen');

      const panel = fixture.debugElement.nativeElement.querySelector(
        'mat-expansion-panel-header'
      );

      panel.click();
      expect(component.handlePanelOpen).toHaveBeenCalled();
    });

    it('should collapse the panel when the panel collapses', () => {
      spyOn(component, 'handlePanelClose');

      const panel = fixture.debugElement.nativeElement.querySelector(
        'mat-expansion-panel-header'
      );

      panel.click();
      panel.click();
      expect(component.handlePanelClose).toHaveBeenCalled();
    });
  });
});
