import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddRuleComponent } from './kvp-add-rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';

describe('KvpAddComponent', () => {
  let component: KvpAddRuleComponent;
  let fixture: ComponentFixture<KvpAddRuleComponent>;

  beforeEach((() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, BrowserAnimationsModule, LoggerTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(KvpAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpAddRuleComponent.isEmpty', () => {
    it('Should return true if the key is empty', () => {
      component.ruleKey.setValue('');
      component.ruleValue.setValue(faker.lorem.sentence());
      expect(component.isKeyEmpty()).toBe(true);
    });

    it('Should return false if the value is empty', () => {
      component.ruleValue.setValue('');
      component.ruleKey.setValue(faker.lorem.sentence());
      expect(component.isKeyEmpty()).toBe(false);
    });

    it('Should return false if both value and key are not empty', () => {
      component.ruleValue.setValue(faker.lorem.word());
      component.ruleKey.setValue(faker.lorem.sentence());
      expect(component.isKeyEmpty()).toBe(false);
    });

    it('Should return false if key is whitespace and value is non-empty', () => {
      component.ruleValue.setValue(faker.lorem.sentence());
      component.ruleKey.setValue('');
      expect(component.isKeyEmpty()).toBe(true);
    });
  });

  describe('KvpAddComponent.onAdd', () => {
    it('Should set key and value to kvp when onAdd() is called, kvp is emitted, and IsValid is true.', () => {
      const input = {
        key: faker.lorem.word(),
        value: faker.lorem.sentence()
      };
      component.ruleKey.setValue(input.key);
      component.ruleValue.setValue(input.value);
      component.ruleType.setValue(RuleType.TEXTSTARTSWITH);
      jest.spyOn(component.kvp, 'emit');
      component.onAdd();
      expect(component.kvp.emit).toHaveBeenCalled();
      expect(component.isValid).toBe(true);
    });

    it('Should set isValid to false if isEmpty is true', () => {
      component.ruleKey.setValue('');
      component.ruleValue.setValue('');
      component.ruleType.setValue(undefined);
      component.onAdd();
      expect(component.isValid).toBe(false);
    });

    it('Should set isValid to false if isRegexEmpty is true', () => {
      component.ruleKey.setValue(faker.lorem.word());
      component.ruleType.setValue(RuleType.REGEX);
      component.onAdd();
      expect(component.isValid).toBe(false);
    });
    it('Should set isValid to true if isRegexEmpty is false', () => {
      component.ruleKey.setValue(faker.lorem.word());
      component.ruleValue.setValue(faker.lorem.sentence());
      component.ruleType.setValue(RuleType.REGEX);
      component.onAdd();
      expect(component.isValid).toBe(true);
    });
    it('Should set isValid to false if key contains whitespace', () => {
      component.ruleKey.setValue(faker.lorem.sentence());
      component.ruleValue.setValue(faker.lorem.sentence());
      component.ruleType.setValue(RuleType.REGEX);
      component.onAdd();
      expect(component.isValid).toBe(false);
    });
  });
});
