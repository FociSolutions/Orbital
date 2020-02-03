import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { MatCardModule } from '@angular/material';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { UrlListItemRuleTypeComponent } from './url-list-item-rule-type.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';

describe('UrlListItemRuleTypeComponent', () => {
  let component: UrlListItemRuleTypeComponent;
  let fixture: ComponentFixture<UrlListItemRuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ],
      declarations: [UrlListItemRuleTypeComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlListItemRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('url-list-item-rule-type', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.currentKVP = {} as KeyValuePairRule;
    });

    it('should contain correct key value pair', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairRule = {
        type: faker.random.arrayElement([
          RuleType.ACCEPTALL,
          RuleType.REGEX,
          RuleType.TEXTEQUALS
        ]),
        rule: kvp
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });

    it('should set the value for current url kvp', () => {
      component.currentKVP = {
        rule: {},
        type: RuleType.TEXTEQUALS
      } as KeyValuePairRule;
      const testValue = faker.lorem.sentence();
      component.value = testValue;
      expect(component.value).toEqual(testValue);
    });

    it('should set the rule type for current rule type', () => {
      const testRule = faker.random.arrayElement([
        RuleType.ACCEPTALL,
        RuleType.REGEX,
        RuleType.TEXTEQUALS
      ]);
      component.ruleType = testRule;
      expect(component.ruleType).toEqual(testRule);
    });
  });

  describe('onRemove', () => {
    it('should emit a remove event', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairRule = {
        type: RuleType.TEXTEQUALS,
        rule: kvp
      };

      component.kvp = input;

      component.removeKvp.subscribe((actual: KeyValuePairRule) => {
        expect(actual).toEqual(input);
      });
      component.onRemove();
    });
  });

  describe('UrlListItemRuleComponent.ruleTypeisAcceptAll', () => {
    it('Should return true if ruleType is AcceptAll', () => {
      component.currentKVP.type = RuleType.ACCEPTALL;
      expect(component.ruleTypeisAcceptAll()).toBeTruthy();
    });
    it('Should return false if ruleType is not AcceptAll', () => {
      component.currentKVP.type = RuleType.REGEX;
      expect(component.ruleTypeisAcceptAll()).toBe(false);
    });
  });
});
