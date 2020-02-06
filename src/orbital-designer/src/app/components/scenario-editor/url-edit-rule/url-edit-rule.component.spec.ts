import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { UrlEditRuleComponent } from './url-edit-rule.component';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';
import * as faker from 'faker';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from '../../../models/mock-definition/scenario/rule.type';
import { UrlAddRuleComponent } from './url-add-rule/url-add-rule.component';
import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type/url-list-item-rule-type.component';

describe('UrlEditRuleComponent', () => {
  let component: UrlEditRuleComponent;
  let fixture: ComponentFixture<UrlEditRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        LoggerTestingModule,
        BrowserAnimationsModule,
        MatCardModule
      ],
      declarations: [
        UrlEditRuleComponent,
        UrlAddRuleComponent,
        UrlListItemRuleTypeComponent
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlEditRuleComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UrlEditRuleComponent.deleteKvpFromRule', () => {
    it('should not delete the kvp if it is undefined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() }
        }
      ] as KeyValuePairRule[];
      component.urlRules = kvpType;
      component.deleteUrlEditRuleHandler(undefined);
      expect(component.urlRules.length).toBe(1);
    });

    it('should not delete the kvp if the rule is undefined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType
        }
      ] as KeyValuePairRule[];
      component.urlRules = kvpType;
      component.deleteUrlEditRuleHandler(undefined);
      expect(component.urlRules.length).toBe(1);
    });

    it('should delete the kvp if it defined', () => {
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: faker.random.word() } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.urlRules = kvpType;
      component.deleteUrlEditRuleHandler(kvpType[0]);
      expect(component.urlRules.length).toBe(0);
    });

    it('should delete the kvp by key if there are multiple similar kvps', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const kvpType = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { test: randomWord } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testtwo: randomWord } as Record<string, string>
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1
          }) as RuleType,
          rule: { testthree: randomWord } as Record<string, string>
        }
      ] as KeyValuePairRule[];
      component.urlRules = kvpType;
      component.deleteUrlEditRuleHandler(kvpType[0]);
      expect(component.urlRules.length).toBe(2);
    });
  });

  describe('KvpEditRuleComponent.addKvp', () => {
    it('should save valid key value pair', () => {
      const kvp = {
        type: faker.random.number({
          min: 0,
          max: Object.keys(RuleType).length - 1
        }) as RuleType,
        rule: {
          [faker.random.word()]: faker.random.word()
        } as Record<string, string>
      } as KeyValuePairRule;
      component.addUrlEditRuleHandler(kvp);
      expect(component.urlRules.length).toBe(1);
      expect(component.urlRules[0]).toEqual(kvp);
    });
  });

  it('should not save repeated key value pair', () => {
    const kvp = {
      type: faker.random.number({
        min: 0,
        max: Object.keys(RuleType).length - 1
      }) as RuleType,
      rule: {
        [faker.random.word()]: faker.random.word()
      } as Record<string, string>
    } as KeyValuePairRule;
    component.addUrlEditRuleHandler(kvp);
    component.addUrlEditRuleHandler(kvp);
    expect(component.urlRules.length).toBe(1);
    expect(component.urlRules[0]).toEqual(kvp);
  });
});
