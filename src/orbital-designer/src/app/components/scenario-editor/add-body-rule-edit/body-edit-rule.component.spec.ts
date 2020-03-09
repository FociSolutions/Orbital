import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material';
import * as faker from 'faker';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from '../../../models/mock-definition/scenario/rule.type';
import { DesignerStore } from 'src/app/store/designer-store';
import { defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { recordFirstOrDefault } from 'src/app/models/record';
import { BodyEditRuleComponent } from './body-edit-rule.component';
import { BodyAddRuleComponent } from './body-add-rule/body-add-rule.component';
import { BodyListItemRuleTypeComponent } from './body-list-item-rule-type/body-list-item-rule-type.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

describe('BodyEditRuleComponent', () => {
  let component: BodyEditRuleComponent;
  let fixture: ComponentFixture<BodyEditRuleComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule],
      declarations: [BodyEditRuleComponent, BodyAddRuleComponent, BodyListItemRuleTypeComponent],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyEditRuleComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    designerStore.selectedScenario = defaultScenario;
    const scenarioFormGroup = new ScenarioFormBuilder(new FormBuilder()).createNewScenarioForm();
    component.bodyMatchRuleFormArray = scenarioFormGroup.get('requestMatchRules.bodyMatchRules') as FormArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('BodyEditRuleComponent.deleteKvpFromRule', () => {
    it('should delete the body rule if it defined', () => {
      const bodyRule = {
        type: faker.random.number({
          min: 0,
          max: Object.keys(RuleType).length - 1
        }) as RuleType,
        rule: { test: faker.random.word() }
      } as KeyValuePairRule;
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(recordFirstOrDefault(bodyRule.rule, 'bodyPath'), [
            Validators.required,
            Validators.maxLength(3000)
          ]),
          ruleType: new FormControl(bodyRule.type, [Validators.required])
        })
      );
      component.deleteBodyEditRuleHandler(0);
      expect(component.bodyMatchRuleFormArray.length).toBe(0);
    });

    it('should delete the body rule by key if there are multiple similar kvps', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const bodyRules = [
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

      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(recordFirstOrDefault(bodyRules[0].rule, 'bodyPath'), [
            Validators.required,
            Validators.maxLength(3000)
          ]),
          ruleType: new FormControl(bodyRules[0].type, [Validators.required])
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(recordFirstOrDefault(bodyRules[1].rule, 'bodyPath'), [
            Validators.required,
            Validators.maxLength(3000)
          ]),
          ruleType: new FormControl(bodyRules[1].type, [Validators.required])
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          path: new FormControl(recordFirstOrDefault(bodyRules[2].rule, 'bodyPath'), [
            Validators.required,
            Validators.maxLength(3000)
          ]),
          ruleType: new FormControl(bodyRules[2].type, [Validators.required])
        })
      );
      component.deleteBodyEditRuleHandler(0);
      expect(component.bodyMatchRuleFormArray.length).toBe(2);
    });
  });

  describe('BodyEditRuleComponent.addBodyEditRuleHandler', () => {
    it('should save valid body rule', () => {
      const bodyRule = {
        type: faker.random.number({
          min: 0,
          max: Object.keys(RuleType).length - 1
        }) as RuleType,
        rule: {
          [faker.random.word()]: faker.random.word()
        } as Record<string, string>
      } as KeyValuePairRule;
      const bodyRuleasFormGroup = new FormGroup({
        path: new FormControl(recordFirstOrDefault(bodyRule.rule, 'bodyPath'), [
          Validators.required,
          Validators.maxLength(3000)
        ]),
        ruleType: new FormControl(bodyRule.type, [Validators.required])
      });
      component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
      expect(component.bodyMatchRuleFormArray.length).toBe(1);
      expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
    });
  });

  it('should not save repeated body rule', () => {
    const bodyRule = {
      type: faker.random.number({
        min: 0,
        max: Object.keys(RuleType).length - 1
      }) as RuleType,
      rule: "{'x': 'y'}"
    } as unknown as BodyRule;
    const bodyRuleasFormGroup = new FormGroup({
      rule: new FormControl(bodyRule.rule, [
        Validators.required,
      ]),
      type: new FormControl(bodyRule.type, [Validators.required])
    });
    component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
    component.addBodyEditRuleHandler(bodyRule);
    expect(component.bodyMatchRuleFormArray.length).toBe(1);
    expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
  });
});
