import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { MatCardModule } from '@angular/material';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';
import { LoggerTestingModule } from 'ngx-logger/testing';

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
    });

    it('should contain correct key value pair', () => {
      const kvp = {};
      kvp[faker.lorem.sentence()] = faker.lorem.sentence();
      const input: KeyValuePairType = {
        type: RuleType.TEXTEQUALS,
        rule: kvp as KeyValueIndexSig
      };

      component.kvp = input;

      expect(component.currentKVP).toEqual(input);
    });

    it('should set the key for current kvp', () => {
      const testKey = faker.lorem.sentence();
      component.key = testKey;
      expect(component.key).toEqual(testKey);
    });

    it('should set the value for current kvp', () => {
      const testValue = faker.lorem.sentence();
      component.value = testValue;
      expect(component.value).toEqual(testValue);
    });

    it('should set the rule type for current rule type', () => {
      const testRule = faker.random.number({ min: 0, max: 8 });
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
