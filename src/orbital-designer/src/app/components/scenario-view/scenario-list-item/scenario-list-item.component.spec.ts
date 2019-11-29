import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { ScenarioListItemComponent } from './scenario-list-item.component';
import { MatCardModule } from '@angular/material/card';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { DialogBoxComponent } from '../../orbital-common/dialog-box/dialog-box.component';
import { DesignerStore } from './../../../store/designer-store';
import validMockDefinition from '../../../../test-files/test-mockdefinition-object';
import { RouterTestingModule } from '@angular/router/testing';
import { VerbType } from 'src/app/models/verb.type';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import * as uuid from 'uuid';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

describe('ScenarioListItemComponent', () => {
  let component: ScenarioListItemComponent;
  let fixture: ComponentFixture<ScenarioListItemComponent>;
  let store: DesignerStore;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ScenarioListItemComponent, DialogBoxComponent],
      imports: [
        MatCardModule,
        LoggerTestingModule,
        MatMenuModule,
        MatIconModule,
        RouterTestingModule
      ],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ScenarioListItemComponent);
    component = fixture.componentInstance;
    store = TestBed.get(DesignerStore);
    store.mockDefinition = validMockDefinition;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  it('should return Not Found for a 404 status', () => {
     const mockverb = VerbType.GET;
     const path = '/test';
     component.scenario = {
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
     component.scenario.response.status = 404;
     expect(component.getScenarioResponseStatusString()).toBe('Not Found');
  });

  it('should return Accepted for a 202 status', () => {
    const mockverb = VerbType.GET;
    const path = '/test';
    component.scenario = {
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
    component.scenario.response.status = 202;
    expect(component.getScenarioResponseStatusString()).toBe('Accepted');
  });

  describe('ScenarioListItemComponent.deleteScenario', () => {
    it('should delete a scenario from the store', () => {
      const mockverb = VerbType.GET;
      const path = '/test';
      component.scenario = {
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
      store.updateScenarios([component.scenario]);
      component.deleteScenario();
      expect(store.state.mockDefinition.scenarios).toEqual([]);
    });
  });
});
