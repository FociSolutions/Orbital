import { ComponentFixture, TestBed } from '@angular/core/testing';
import { KvpEditRuleComponent } from './kvp-edit-rule.component';
import { SharedModule } from '../../../shared/shared.module';
import { LoggerTestingModule } from 'ngx-logger/testing/';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type/kvp-list-item-rule-type.component';
import { MatCardModule } from '@angular/material/card';
import { RuleType } from '../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import * as faker from 'faker';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../scenario-form-builder/scenario-form.builder';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { recordFirstOrDefault, recordFirstOrDefaultKey } from 'src/app/models/record';
describe('KvpEditRuleComponent', () => {
  let component: KvpEditRuleComponent;
  let fixture: ComponentFixture<KvpEditRuleComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [SharedModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule],
      declarations: [KvpListItemRuleTypeComponent, KvpEditRuleComponent],
      providers: [DesignerStore, ScenarioFormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(KvpEditRuleComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
    designerStore.selectedScenario = emptyScenario;
    const scenarioFormGroup = scenarioFormBuilder.createNewScenarioForm();
    component.matchRuleFormArray = (scenarioFormGroup.controls.requestMatchRules as FormGroup).controls
      .queryMatchRules as FormArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('KvpEditRuleComponent.deleteKvpFromRule', () => {
    it('should not delete the kvp if it is defined', () => {
      const kvpType = {
        type: faker.datatype.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }) as RuleType,
        rule: { test: faker.random.word() },
      } as KeyValuePairRule;
      component.matchRuleFormArray.push(
        new FormGroup({
          key: new FormControl(recordFirstOrDefaultKey(kvpType.rule, ''), [
            Validators.required,
            Validators.maxLength(200),
          ]),
          value: new FormControl(recordFirstOrDefault(kvpType.rule, ''), [
            Validators.required,
            Validators.maxLength(3000),
          ]),
          type: new FormControl(kvpType.type, [Validators.required]),
        })
      );
      component.deleteKvpFromRule(0);
      expect(component.matchRuleFormArray.length).toBe(0);
    });

    it('should delete the kvp if it defined', () => {
      const kvpType = {
        type: faker.datatype.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }) as RuleType,
        rule: { test: faker.random.word() },
      } as KeyValuePairRule;
      component.matchRuleFormArray.push(
        new FormGroup({
          key: new FormControl(recordFirstOrDefaultKey(kvpType.rule, ''), [
            Validators.required,
            Validators.maxLength(200),
          ]),
          value: new FormControl(recordFirstOrDefault(kvpType.rule, ''), [
            Validators.required,
            Validators.maxLength(3000),
          ]),
          type: new FormControl(kvpType.type, [Validators.required]),
        })
      );
      component.deleteKvpFromRule(0);
      expect(component.matchRuleFormArray.length).toBe(0);
    });

    it('should delete the kvp by key if there are multiple similar kvps', () => {
      const randomWord = faker.random.word();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const kvpType = [
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { test: randomWord } as Record<string, string>,
        },
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { testtwo: randomWord } as Record<string, string>,
        },
        {
          type: faker.datatype.number({
            min: 0,
            max: Object.keys(RuleType).length - 1,
          }) as RuleType,
          rule: { testthree: randomWord } as Record<string, string>,
        },
      ] as KeyValuePairRule[];
      component.matchRuleFormArray.push(
        new FormGroup({
          key: new FormControl(recordFirstOrDefaultKey(kvpType[0].rule, ''), [
            Validators.required,
            Validators.maxLength(200),
          ]),
          value: new FormControl(recordFirstOrDefault(kvpType[0].rule, ''), [
            Validators.required,
            Validators.maxLength(3000),
          ]),
          type: new FormControl(kvpType[0].type, [Validators.required]),
        })
      );
      component.matchRuleFormArray.push(
        new FormGroup({
          key: new FormControl(recordFirstOrDefaultKey(kvpType[1].rule, ''), [
            Validators.required,
            Validators.maxLength(200),
          ]),
          value: new FormControl(recordFirstOrDefault(kvpType[1].rule, ''), [
            Validators.required,
            Validators.maxLength(3000),
          ]),
          type: new FormControl(kvpType[1].type, [Validators.required]),
        })
      );
      component.matchRuleFormArray.push(
        new FormGroup({
          key: new FormControl(recordFirstOrDefaultKey(kvpType[2].rule, ''), [
            Validators.required,
            Validators.maxLength(200),
          ]),
          value: new FormControl(recordFirstOrDefault(kvpType[2].rule, ''), [
            Validators.required,
            Validators.maxLength(3000),
          ]),
          type: new FormControl(kvpType[2].type, [Validators.required]),
        })
      );
      component.deleteKvpFromRule(0);
      expect(component.matchRuleFormArray.length).toBe(2);
    });
  });

  describe('KvpEditRuleComponent.addKvp', () => {
    it('should save valid key value pair', () => {
      const kvp = {
        type: faker.datatype.number({
          min: 0,
          max: Object.keys(RuleType).length - 1,
        }) as RuleType,
        rule: { test: faker.random.word() },
      } as KeyValuePairRule;
      component.addKvp(kvp);
      expect(component.matchRuleFormArray.length).toBe(1);
    });
  });

  it('should not save repeated key value pair', () => {
    const kvp = {
      type: faker.datatype.number({
        min: 0,
        max: Object.keys(RuleType).length - 1,
      }) as RuleType,
      rule: { test: faker.random.word() },
    } as KeyValuePairRule;
    const kvpForm = new FormGroup({
      key: new FormControl(recordFirstOrDefaultKey(kvp.rule, ''), [Validators.required, Validators.maxLength(200)]),
      value: new FormControl(recordFirstOrDefault(kvp.rule, ''), [Validators.required, Validators.maxLength(3000)]),
      type: new FormControl(kvp.type, [Validators.required]),
    });
    component.matchRuleFormArray.push(kvpForm);
    component.addKvp(kvp);
    expect(component.matchRuleFormArray.length).toBe(1);
    expect(component.matchRuleFormArray.at(0) as FormGroup).toEqual(kvpForm);
  });
});
