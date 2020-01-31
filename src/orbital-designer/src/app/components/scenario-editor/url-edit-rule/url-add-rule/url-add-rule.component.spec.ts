import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { UrlAddRuleComponent } from './url-add-rule.component';
import { MatCardModule } from '@angular/material';

describe('UrlAddRuleComponent', () => {
  let component: UrlAddRuleComponent;
  let fixture: ComponentFixture<UrlAddRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [UrlAddRuleComponent],
      imports: [
        OrbitalCommonModule,
        BrowserAnimationsModule,
        LoggerTestingModule,
        MatCardModule
      ]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UrlAddRuleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('UrlAddRuleComponent.onAdd', () => {
    it('Should set key and value to kvp when onAdd() is called, kvp is emitted, and IsValid is true.', () => {
      const input = {
        value: faker.lorem.sentence()
      };
      component.value = input.value;
      component.ruleType = RuleType.TEXTSTARTSWITH;
      spyOn(component.kvp, 'emit');
      component.onAdd();
      expect(component.kvp.emit).toHaveBeenCalled();
      expect(component.isValid).toBe(true);
    });

    it('Should set isValid to false if isValueEmpty is true', () => {
      component.value = '';
      component.ruleType = RuleType.REGEX;
      component.onAdd();
      expect(component.isValid).toBe(false);
    });

    it('Should set isValid to false if isRuleTypeEmpty is true', () => {
      component.value = faker.lorem.sentence();
      component.ruleType = undefined;
      component.onAdd();
      expect(component.isValid).toBe(false);
    });

    it('Should set isValid to false if isRegexEmpty is true', () => {
      component.value = '';
      component.ruleType = RuleType.REGEX;
      component.onAdd();
      expect(component.isValid).toBe(false);
    });
    it('Should set isValid to true if isRegexEmpty is false', () => {
      component.value = faker.lorem.sentence();
      component.ruleType = RuleType.REGEX;
      component.onAdd();
      expect(component.isValid).toBe(true);
    });
  });

  describe('UrlAddRuleComponent.ruleTypeisAcceptAll', () => {
    it('Should return true if ruleType is AcceptAll', () => {
      component.ruleType = RuleType.ACCEPTALL;
      expect(component.ruleTypeisAcceptAll()).toBe(true);
    });
    it('Should return false if ruleType is not AcceptAll', () => {
      component.ruleType = RuleType.REGEX;
      expect(component.ruleTypeisAcceptAll()).toBe(false);
    });
  });
});
