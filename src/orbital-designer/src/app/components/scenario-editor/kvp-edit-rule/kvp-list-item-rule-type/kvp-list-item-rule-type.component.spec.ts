import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { MatCardModule } from '@angular/material';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { recordFirstOrDefaultKey, recordFirstOrDefault } from 'src/app/models/record';
import { FormGroup, FormControl, Validators, FormBuilder, FormArray } from '@angular/forms';
import { ScenarioFormBuilder } from '../../scenario-form-builder/scenario-form.builder';
import { DesignerStore } from 'src/app/store/designer-store';
import { defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';

describe('KvpListItemRuleComponent', () => {
  let component: KvpListItemRuleTypeComponent;
  let fixture: ComponentFixture<KvpListItemRuleTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, MatCardModule, BrowserAnimationsModule, LoggerTestingModule],
      declarations: [KvpListItemRuleTypeComponent, KvpEditRuleComponent],
      providers: [DesignerStore]
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(KvpListItemRuleTypeComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    designerStore.selectedScenario = defaultScenario;
    const scenarioFormGroup = new ScenarioFormBuilder(new FormBuilder()).createNewScenarioForm();
    ((scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.queryMatchRules as FormArray).push(
      new FormGroup({
        key: new FormControl('', [Validators.required, Validators.maxLength(200)]),
        value: new FormControl('', [Validators.required, Validators.maxLength(3000)]),
        type: new FormControl(RuleType.NONE, [Validators.required])
      })
    );
    component.editRuleFormGroup = ((scenarioFormGroup.controls.requestMatchRules as FormGroup).controls
      .queryMatchRules as FormArray).at(0) as FormGroup;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('kvp-list-item-rule-type', () => {
    it('should set the key for current kvp', () => {
      const testKey = faker.lorem.sentence();
      component.key.setValue(testKey);
      expect(component.key.value).toEqual(testKey);
    });

    it('should set the value for current kvp', () => {
      const testValue = faker.lorem.sentence();
      component.value.setValue(testValue);
      expect(component.value.value).toEqual(testValue);
    });

    it('should set the rule type for current rule type', () => {
      const testRule = faker.random.number({
        min: 0,
        max: Object.keys(RuleType).length - 1
      });
      component.ruleType.setValue(testRule);
      expect(component.ruleType.value).toEqual(testRule);
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

      component.key.setValue(recordFirstOrDefaultKey(input.rule, ''));
      component.value.setValue(recordFirstOrDefault(input.rule, ''));
      component.removeKvp.subscribe((actual: KeyValuePairRule) => {
        expect(actual.type).toEqual(input.type);
      });
      component.onRemove();
    });
  });
});
