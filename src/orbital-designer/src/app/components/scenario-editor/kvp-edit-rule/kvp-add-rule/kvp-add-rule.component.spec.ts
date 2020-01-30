import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpAddRuleComponent } from './kvp-add-rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';

describe('KvpAddComponent', () => {
  let component: KvpAddRuleComponent;
  let fixture: ComponentFixture<KvpAddRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpAddRuleComponent.isEmpty', () => {
    it('Should return true if the key is empty', () => {
      component.key = '';
      component.value = faker.lorem.sentence();
      expect(component.isKeyEmpty()).toBe(true);
    });

    it('Should return false if the value is empty', () => {
      component.value = '';
      component.key = faker.lorem.sentence();
      expect(component.isKeyEmpty()).toBe(false);
    });

    it('Should return false if both value and key are not empty', () => {
      component.value = faker.lorem.sentence();
      component.key = faker.lorem.sentence();
      expect(component.isKeyEmpty()).toBe(false);
    });

    it('Should return false if key is whitespace and value is non-empty', () => {
      component.value = faker.lorem.sentence();
      component.key = ' ';
      expect(component.isKeyEmpty()).toBe(true);
    });

    it('Should return true if the value is empty', () => {
      component.ruleType = undefined;
      expect(component.isRuleTypeEmpty()).toBe(true);
    });

    it('Should return false if the value is valid', () => {
      component.ruleType = RuleType.TEXTENDSWITH;
      expect(component.isRuleTypeEmpty()).toBe(false);
    });
  });

  describe('KvpAddComponent.onAdd', () => {
    it('Should set key and value to kvp when onAdd() is called, kvp is emitted, and IsValid is true.', () => {
      const input = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };
      component.key = input.key;
      component.value = input.value;
      component.ruleType = RuleType.TEXTSTARTSWITH;
      spyOn(component.kvp, 'emit');
      component.onAdd();
      expect(component.kvp.emit).toHaveBeenCalled();
      expect(component.isValid).toBe(true);
    });

    it('Should set isValid to false if isEmpty is true', () => {
      component.key = '';
      component.value = '';
      component.ruleType = null;
      component.onAdd();
      expect(component.isValid).toBe(false);
    });

    it('Should set isValid to false if isRegexEmpty is true', () => {
      component.key = faker.lorem.sentence();
      component.ruleType = RuleType.REGEX;
      component.onAdd();
      expect(component.isValid).toBe(false);
    });
    it('Should set isValid to true if isRegexEmpty is false', () => {
      component.key = faker.lorem.sentence();
      component.value = faker.lorem.sentence();
      component.ruleType = RuleType.REGEX;
      component.onAdd();
      expect(component.isValid).toBe(true);
    });
  });
  describe('KvpAddComponent.isRegexEmpty', () => {
    it('Should return true if rule type is regex and value is undefined', () => {
      const input = {
        key: faker.lorem.sentence()
      };
      component.key = input.key;
      component.ruleType = RuleType.REGEX;
      expect(component.isRegexEmpty()).toBe(true);
    });

    it('Should return false if rule type is REGEX and value is defined', () => {
      const input = {
        key: faker.lorem.sentence(),
        value: faker.lorem.sentence()
      };
      component.key = input.key;
      component.value = input.value;
      component.ruleType = RuleType.REGEX;
      expect(component.isRegexEmpty()).toBe(false);
    });
  });
});
