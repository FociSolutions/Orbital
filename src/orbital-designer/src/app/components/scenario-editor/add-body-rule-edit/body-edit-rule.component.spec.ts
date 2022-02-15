/* eslint-disable prettier/prettier */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SharedModule } from '../../../shared/shared.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import * as faker from 'faker';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.type';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { BodyEditRuleComponent } from './body-edit-rule.component';
import { BodyAddRuleComponent } from './body-add-rule/body-add-rule.component';
import { BodyListItemRuleTypeComponent } from './body-list-item-rule-type/body-list-item-rule-type.component';
import { JsonEditorComponent } from 'ang-jsoneditor';
import { FormBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/form-body-rule.model';

describe('BodyEditRuleComponent', () => {
  let component: BodyEditRuleComponent;
  let fixture: ComponentFixture<BodyEditRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule],
      declarations: [BodyEditRuleComponent, BodyAddRuleComponent, BodyListItemRuleTypeComponent, JsonEditorComponent],
      providers: [DesignerStore],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BodyEditRuleComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.inject(DesignerStore) as DesignerStore;
    const scenarioFormBuilder = TestBed.inject(ScenarioFormBuilder) as ScenarioFormBuilder;
    designerStore.selectedScenario = emptyScenario;
    const scenarioFormGroup = scenarioFormBuilder.createNewScenarioForm();
    component.bodyMatchRuleFormArray = scenarioFormGroup.get('requestMatchRules.bodyMatchRules') as FormArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('BodyEditRuleComponent.deleteBodyEditRuleHandler', () => {
    it('should delete the body rule if it defined', () => {
      const bodyRule: FormBodyRule = {
        ruleType: faker.datatype.number({
          min: 0,
          max: Object.keys(BodyRuleType).length - 1,
        }),
        rule: { test: faker.random.word() },
        ruleCondition: faker.datatype.number({
          min: 0,
          max: 3,
        }),
      };
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRule.rule, [Validators.required, Validators.maxLength(3000)]),
          ruleType: new FormControl(bodyRule.ruleType, [Validators.required]),
          ruleCondition: new FormControl(bodyRule.ruleCondition, [Validators.required]),
        })
      );
      component.deleteBodyEditRuleHandler(0);
      expect(component.bodyMatchRuleFormArray.length).toBe(0);
    });

    it('should delete the body rule by key if there are multiple similar rules', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const bodyRules: FormBodyRule[] = [
        {
          ruleType: faker.datatype.number({
            min: 0,
            max: Object.keys(BodyRuleType).length - 1,
          }),
          rule: { test: randomWord },
          ruleCondition: faker.datatype.number({
            min: 0,
            max: 3,
          }),
        },
        {
          ruleType: faker.datatype.number({
            min: 0,
            max: Object.keys(BodyRuleType).length - 1,
          }),
          rule: { testtwo: randomWord },
          ruleCondition: faker.datatype.number({
            min: 0,
            max: 3,
          }),
        },
        {
          ruleType: faker.datatype.number({
            min: 0,
            max: Object.keys(BodyRuleType).length - 1,
          }),
          rule: { testthree: randomWord },
          ruleCondition: faker.datatype.number({
            min: 0,
            max: 3,
          }),
        },
      ];

      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[0].rule, [Validators.required, Validators.maxLength(3000)]),
          ruleType: new FormControl(bodyRules[0].ruleType, [Validators.required]),
          ruleCondition: new FormControl(bodyRules[0].ruleCondition, [Validators.required]),
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[1].rule, [Validators.required, Validators.maxLength(3000)]),
          ruleType: new FormControl(bodyRules[1].ruleType, [Validators.required]),
          ruleCondition: new FormControl(bodyRules[1].ruleCondition, [Validators.required]),
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[2].rule, [Validators.required, Validators.maxLength(3000)]),
          ruleType: new FormControl(bodyRules[2].ruleType, [Validators.required]),
          ruleCondition: new FormControl(bodyRules[2].ruleCondition, [Validators.required]),
        })
      );
      component.deleteBodyEditRuleHandler(0);
      expect(component.bodyMatchRuleFormArray.length).toBe(2);
    });
  });

  describe('BodyEditRuleComponent.addBodyEditRuleHandler', () => {
    it('should save valid body rule', () => {
      const bodyRule: FormBodyRule = {
        ruleType: faker.datatype.number({
          min: 0,
          max: Object.keys(BodyRuleType).length - 1,
        }),
        rule: {
          [faker.random.word()]: faker.random.word(),
        },
        ruleCondition: faker.datatype.number({
          min: 0,
          max: 3,
        }),
      };
      const bodyRuleasFormGroup = new FormGroup({
        rule: new FormControl(bodyRule.rule, [Validators.required, Validators.maxLength(3000)]),
        ruleType: new FormControl(bodyRule.ruleType, [Validators.required]),
        ruleCondition: new FormControl(bodyRule.ruleCondition, [Validators.required]),
      });
      component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
      expect(component.bodyMatchRuleFormArray.length).toBe(1);
      expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
    });
  });

  it('should not save repeated body rule', () => {
    const bodyRule: FormBodyRule = {
      ruleType: faker.datatype.number({
        min: 0,
        max: Object.keys(BodyRuleType).length - 1,
      }),
      rule: { x: 'y' },
      ruleCondition: faker.datatype.number({
        min: 0,
        max: 3,
      }),
    };
    const bodyRuleasFormGroup = new FormGroup({
      rule: new FormControl(bodyRule.rule, [Validators.required]),
      ruleType: new FormControl(bodyRule.ruleType, [Validators.required]),
      ruleCondition: new FormControl(bodyRule.ruleCondition, [Validators.required]),
    });
    component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
    component.addBodyEditRuleHandler(bodyRule);
    expect(component.bodyMatchRuleFormArray.length).toBe(1);
    expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
  });
});
