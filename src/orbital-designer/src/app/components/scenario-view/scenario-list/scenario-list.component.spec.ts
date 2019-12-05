import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ScenarioListComponent } from './scenario-list.component';
import { MatListModule } from '@angular/material/list';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { MatCardModule } from '@angular/material/card';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DesignerStore } from '../../../store/designer-store';
import testMockdefinitionObject from 'src/test-files/test-mockdefinition-object';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RouterModule } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { VerbType } from 'src/app/models/verb.type';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import * as uuid from 'uuid';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';

describe('ScenarioListComponent', () => {
  let component: ScenarioListComponent;
  let fixture: ComponentFixture<ScenarioListComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        ScenarioListComponent,
        DialogBoxComponent
      ],
      imports: [
        MatListModule,
        MatCardModule,
        MatMenuModule,
        MatIconModule,
        RouterModule,
        RouterTestingModule,
        LoggerTestingModule
      ],

      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListComponent);
    component = fixture.componentInstance;

    // force the object to be copied; Object.assign() and spread operator do not work here
    component.scenarios = JSON.parse(
      JSON.stringify(testMockdefinitionObject.scenarios)
    );

    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition;
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

  it('should return Not Found for a 404 status', () => {
    const mockverb = VerbType.GET;
    const path = '/test';
    const scenario = {
     id: uuid.v4(),
     metadata: {
       title: 'New Scenario',
       description: ''
     },
     mockverb,
     path,
     response: {
       headers: new Map<string, string>(),
       status: 0,
       body: ''
     },
     requestMatchRules: {
       headerRules: new Map<string, string>(),
       queryRules: new Map<string, string>(),
       bodyRules: [
         {
           type: BodyRuleType.BodyEquality,
           rule: {}
         }
       ] as Array<BodyRule>
     }
   } as unknown as Scenario;
    scenario.response.status = 404;
    expect(component.getScenarioResponseStatusString(scenario)).toBe('Not Found');
 });

  it('should return Accepted for a 202 status', () => {
   const mockverb = VerbType.GET;
   const path = '/test';
   const scenario = {
    id: uuid.v4(),
    metadata: {
      title: 'New Scenario',
      description: ''
    },
    mockverb,
    path,
    response: {
      headers: new Map<string, string>(),
      status: 0,
      body: ''
    },
    requestMatchRules: {
      headerRules: new Map<string, string>(),
      queryRules: new Map<string, string>(),
      bodyRules: [
        {
          type: BodyRuleType.BodyEquality,
          rule: {}
        }
      ] as Array<BodyRule>
    }
  } as unknown as Scenario;
   scenario.response.status = 202;
   expect(component.getScenarioResponseStatusString(scenario)).toBe('Accepted');
 });

  describe('ScenarioListItemComponent.deleteScenario', () => {
   it('should delete a scenario from the store', () => {
     const mockverb = VerbType.GET;
     const path = '/test';
     const scenario = {
      id: uuid.v4(),
      metadata: {
        title: 'New Scenario',
        description: ''
      },
      mockverb,
      path,
      response: {
        headers: new Map<string, string>(),
        status: 0,
        body: ''
      },
      requestMatchRules: {
        headerRules: new Map<string, string>(),
        queryRules: new Map<string, string>(),
        bodyRules: [
          {
            type: BodyRuleType.BodyEquality,
            rule: {}
          }
        ] as Array<BodyRule>
      }
    } as unknown as Scenario;
     store.updateScenarios([scenario]);
     component.deleteScenario(scenario);
     expect(store.state.mockDefinition.scenarios).toEqual([]);
   });
 });
});
