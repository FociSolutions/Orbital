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

    // force the object to be copied; Object.assign() and spread operator do not work here
    component.scenarios = JSON.parse(JSON.stringify(testMockdefinitionObject.scenarios));
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

  it('should display the unknown scenario description if the status code is invalid', () => {
    component.scenarios[0].response.status = 0;
    fixture.detectChanges();
    const compiled = fixture.debugElement.childNodes[0].nativeNode;
    expect(compiled.textContent).toContain(
      'Unknown'
    );
    // component should not crash
    expect(component).toBeTruthy();
  });
});
