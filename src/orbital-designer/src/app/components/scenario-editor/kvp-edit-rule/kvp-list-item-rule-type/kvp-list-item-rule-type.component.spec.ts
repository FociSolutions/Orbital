import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { MatCardModule } from '@angular/material';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { KeyValuePairType } from '../../../../models/mock-definition/scenario/key-value-pair-type.model';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValueIndexSig } from '../../../../models/mock-definition/scenario/key-value-index-sig.model';

describe('KvpListItemRuleComponent', () => {
  let component: KvpListItemRuleTypeComponent;
  let fixture: ComponentFixture<KvpListItemRuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        MatCardModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ],
      declarations: [KvpListItemRuleTypeComponent, KvpEditRuleComponent]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpListItemRuleTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('kvp-list-item-rule-type', () => {
    beforeEach(() => {
      fixture.detectChanges();
      component.currentKVP = {} as KeyValuePairType;
    });

    it('should contain correct key value pair', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairType = {
        type: faker.random.number({ min: 0, max: Object.keys(RuleType).length - 1 }) as RuleType,
        rule: kvp as KeyValueIndexSig
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });

    it('should set the key for current kvp', () => {
      component.currentKVP = {rule: {a: 'b'} as KeyValueIndexSig, type: RuleType.TEXTEQUALS} as KeyValuePairType;
      const testKey = faker.lorem.sentence();
      component.key = testKey;
      expect(component.key).toEqual(testKey);
    });

    it('should set the value for current kvp', () => {
      component.currentKVP = {rule: {}, type: RuleType.TEXTEQUALS} as KeyValuePairType;
      const testValue = faker.lorem.sentence();
      component.value = testValue;
      expect(component.value).toEqual(testValue);
    });

    it('should set the rule type for current rule type', () => {
      const testRule = faker.random.number({ min: 0, max: Object.keys(RuleType).length - 1 });
      component.ruleType = testRule;
      expect(component.ruleType).toEqual(testRule);
    });
  });

  describe('onRemove', () => {
    it('should emit a remove event', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairType = {
        type: RuleType.TEXTEQUALS,
        rule: kvp as KeyValueIndexSig
      };

      component.kvp = input;
      component.onRemove();

      component.removeKvp.subscribe(
        (actual: KeyValuePairType) => expect(actual).toEqual(input),
        (err: { message: any; }) => fail(`Unexpected error: ${err.message}`)
      );
    });
  });
});
