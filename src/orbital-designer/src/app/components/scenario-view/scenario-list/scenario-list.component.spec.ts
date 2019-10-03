import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioListComponent } from './scenario-list.component';
import { MatListModule } from '@angular/material/list';
import { ScenarioListItemComponent } from '../scenario-list-item/scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import testMockdefinitionObject from 'src/test-files/test-mockdefinition-object';
import { LoggerTestingModule } from 'ngx-logger/testing';
describe('ScenarioListComponent', () => {
  let component: ScenarioListComponent;
  let fixture: ComponentFixture<ScenarioListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListComponent, ScenarioListItemComponent],
      imports: [MatListModule, MatCardModule, LoggerTestingModule]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListComponent);
    component = fixture.componentInstance;
    component.scenarios = [...testMockdefinitionObject.scenarios];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display scenario even if status code is invalid', () => {
    component.scenarios[0].response.status = 0;

    // component should not crash
    expect(component).toBeTruthy();
  });
});
