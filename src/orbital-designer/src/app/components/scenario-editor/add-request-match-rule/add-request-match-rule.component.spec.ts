import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { AddRequestMatchRuleComponent } from './add-request-match-rule.component';
import {
  MatExpansionModule,
  MatFormFieldModule,
  MatInputModule,
  MatSelectModule,
  MatCardModule,
  MatDividerModule,
  MatIconModule,
  MatCheckboxModule
} from '@angular/material';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import * as faker from 'faker';
import { KvpAddComponent } from '../../orbital-common/kvp-edit/kvp-add/kvp-add.component';
import { KvpEditComponent } from '../../orbital-common/kvp-edit/kvp-edit.component';
import { KvpListItemComponent } from '../../orbital-common/kvp-edit/kvp-list-item/kvp-list-item.component';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { AddBodyRuleContainerComponent } from '../add-body-rule-container/add-body-rule-container.component';
import { AddBodyRuleComponent } from '../add-body-rule-container/add-body-rule/add-body-rule.component';
import { BodyRuleListItemComponent } from '../add-body-rule-container/body-rule-list-item/body-rule-list-item.component';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { KvpEditRuleComponent } from '../kvp-edit-rule/kvp-edit-rule.component';
import { KvpListItemRuleTypeComponent } from '../kvp-edit-rule/kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { GetRuleTypeStringPipe } from 'src/app/pipes/get-rule-type-string/get-rule-type-string.pipe';
import { KvpAddRuleComponent } from '../kvp-edit-rule/kvp-add-rule/kvp-add-rule.component';

describe('AddRequestMatchRuleComponent', () => {
  let component: AddRequestMatchRuleComponent;
  let fixture: ComponentFixture<AddRequestMatchRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [
        AddRequestMatchRuleComponent,
        KvpAddComponent,
        KvpEditComponent,
        KvpListItemComponent,
        AddBodyRuleContainerComponent,
        AddBodyRuleComponent,
        BodyRuleListItemComponent,
        KvpEditRuleComponent,
        KvpListItemRuleTypeComponent,
        GetRuleTypeStringPipe,
        KvpAddRuleComponent
      ],
      imports: [
        LoggerTestingModule,
        MatExpansionModule,
        MatFormFieldModule,
        MatInputModule,
        MatSelectModule,
        MatCardModule,
        FormsModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatDividerModule,
        MatIconModule,
        MatCheckboxModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequestMatchRuleComponent);
    component = fixture.componentInstance;

    component.requestMatchRule = ({
      headerRules: [],
      queryRules: [],
      bodyRules: [{}] as BodyRule[]
    } as unknown) as RequestMatchRule;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('add-request-match-rule.handleHeaderKvpOutput', () => {
    it('should set the header match rules if it is truthy', () => {
      const headerMatchRules: KeyValuePairRule[] = [
        {
          type: faker.random.number({ min: 0, max: 8 }),
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];

      component.handleHeaderKvpOutput(headerMatchRules);
      expect(component.headerMatchRules).toEqual(headerMatchRules);
    });
  });

  describe('add-request-match-rule.handleQueryKvpOutput', () => {
    it('should set the query match rules if it is truthy', () => {
      const queryMatchRules: KeyValuePairRule[] = [
        {
          type: faker.random.number({ min: 0, max: 8 }),
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];
      component.handleQueryKvpOutput(queryMatchRules);
      expect(component.queryMatchRules).toEqual(queryMatchRules);
    });
  });

  describe('add-request-match-rule.handleBodyOutput', () => {
    it('should set the body match rules if it is truthy', () => {
      const bodyMatchRules = [
        { type: RuleType.JSONEQUALITY, rule: { a: faker.random.word() } }
      ] as BodyRule[];
      component.handleBodyOutput(bodyMatchRules);
      expect(component.bodyMatchRules).toEqual(bodyMatchRules);
    });
  });

  describe('AddRequestMatchRule.Save', () => {
    it('should not emit the request match rules if the header match rules are invalid', () => {
      const testQueryMatchRules = [];
      const testHeaderMatchRules = null;
      const testBodyMatchRules: BodyRule[] = [{}] as BodyRule[];

      component.requestMatchRule.headerRules = testHeaderMatchRules;
      testBodyMatchRules[0].rule = { a: faker.random.word() };
      testBodyMatchRules[0].type = RuleType.JSONEQUALITY;

      spyOn(component.requestMatchRuleOutput, 'emit');
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the query match rules are invalid', () => {
      const testHeaderMatchRules: KeyValuePairRule[] = [
        {
          type: faker.random.number({ min: 0, max: 8 }),
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];
      const testBodyMatchRules: KeyValuePairRule[] = [
        {
          type: null,
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];

      spyOn(component.requestMatchRuleOutput, 'emit');

      const requestMatchRule = {
        headerRules: testHeaderMatchRules,
        queryRules: undefined,
        bodyRules: testBodyMatchRules
      } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });

    it('should not emit the request match rules if the body match rules are invalid', () => {
      const testHeaderMatchRules: KeyValuePairRule[] = [
        {
          type: faker.random.number({ min: 0, max: 8 }),
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];
      const testQueryMatchRules: KeyValuePairRule[] = [
        {
          type: faker.random.number({ min: 0, max: 8 }),
          rule: {
            key: faker.lorem.sentence().toUpperCase(),
            value: faker.lorem.sentence()
          }
        }
      ];

      spyOn(component.requestMatchRuleOutput, 'emit');

      component.headerMatchRules = testHeaderMatchRules;
      component.queryMatchRules = testQueryMatchRules;
      const requestMatchRule = {
        headerRules: testHeaderMatchRules,
        queryRules: testQueryMatchRules,
        bodyRules: undefined
      } as RequestMatchRule;
      component.requestMatchRule = requestMatchRule;
      component.saveStatus = true;

      expect(component.requestMatchRuleOutput.emit).not.toHaveBeenCalled();
    });
  });
});
