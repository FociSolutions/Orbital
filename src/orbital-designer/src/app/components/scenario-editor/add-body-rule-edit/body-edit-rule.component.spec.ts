import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { OrbitalCommonModule } from '../../orbital-common/orbital-common.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import * as faker from 'faker';
import { RuleType } from '../../../models/mock-definition/scenario/rule.type';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { BodyEditRuleComponent } from './body-edit-rule.component';
import { BodyAddRuleComponent } from './body-add-rule/body-add-rule.component';
import { BodyListItemRuleTypeComponent } from './body-list-item-rule-type/body-list-item-rule-type.component';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NgJsonEditorModule } from 'ang-jsoneditor';

describe('BodyEditRuleComponent', () => {
  let component: BodyEditRuleComponent;
  let fixture: ComponentFixture<BodyEditRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule, NgJsonEditorModule],
      declarations: [BodyEditRuleComponent, BodyAddRuleComponent, BodyListItemRuleTypeComponent],
      providers: [DesignerStore],
    }).compileComponents();

    fixture = TestBed.createComponent(BodyEditRuleComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
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
      const bodyRule = {
        type: faker.random.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }) as RuleType,
        rule: { test: faker.random.word() },
      } as BodyRule;
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRule.rule, [Validators.required, Validators.maxLength(3000)]),
          type: new FormControl(bodyRule.type, [Validators.required]),
        })
      );
      component.deleteBodyEditRuleHandler(0);
      expect(component.bodyMatchRuleFormArray.length).toBe(0);
    });

    it('should delete the body rule by key if there are multiple similar rules', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const bodyRules = [
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { test: randomWord },
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { testtwo: randomWord },
        },
        {
          type: faker.random.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { testthree: randomWord },
        },
      ] as BodyRule[];

      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[0].rule, [Validators.required, Validators.maxLength(3000)]),
          type: new FormControl(bodyRules[0].type, [Validators.required]),
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[1].rule, [Validators.required, Validators.maxLength(3000)]),
          type: new FormControl(bodyRules[1].type, [Validators.required]),
        })
      );
      component.bodyMatchRuleFormArray.push(
        new FormGroup({
          rule: new FormControl(bodyRules[2].rule, [Validators.required, Validators.maxLength(3000)]),
          type: new FormControl(bodyRules[2].type, [Validators.required]),
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
          max: Object.keys(RuleType).length - 1,
        }) as RuleType,
        rule: {
          [faker.random.word()]: faker.random.word(),
        },
      } as BodyRule;
      const bodyRuleasFormGroup = new FormGroup({
        rule: new FormControl(bodyRule.rule, [Validators.required, Validators.maxLength(3000)]),
        type: new FormControl(bodyRule.type, [Validators.required]),
      });
      component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
      expect(component.bodyMatchRuleFormArray.length).toBe(1);
      expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
    });
  });

  it('should not save repeated body rule', () => {
    const bodyRule = ({
      type: faker.random.number({
        min: 0,
        max: Object.keys(RuleType).length - 1,
      }) as RuleType,
      rule: "{'x': 'y'}",
    } as unknown) as BodyRule;
    const bodyRuleasFormGroup = new FormGroup({
      rule: new FormControl(bodyRule.rule, [Validators.required]),
      type: new FormControl(bodyRule.type, [Validators.required]),
    });
    component.bodyMatchRuleFormArray.push(bodyRuleasFormGroup);
    component.addBodyEditRuleHandler(bodyRule);
    expect(component.bodyMatchRuleFormArray.length).toBe(1);
    expect(component.bodyMatchRuleFormArray.at(0)).toEqual(bodyRuleasFormGroup);
  });
});
