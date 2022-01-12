import { ComponentFixture, TestBed } from '@angular/core/testing';
import * as faker from 'faker';
import { KvpListItemRuleTypeComponent } from './kvp-list-item-rule-type.component';
import { OrbitalCommonModule } from '../../../orbital-common/orbital-common.module';
import { MatCardModule } from '@angular/material/card';
import { KvpEditRuleComponent } from '../kvp-edit-rule.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { LoggerTestingModule } from 'ngx-logger/testing';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { recordFirstOrDefault, recordFirstOrDefaultKey } from 'src/app/models/record';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { ScenarioFormBuilder } from '../../scenario-form-builder/scenario-form.builder';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';

describe('KvpListItemRuleComponent', () => {
  let component: KvpListItemRuleTypeComponent;
  let fixture: ComponentFixture<KvpListItemRuleTypeComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, MatCardModule, BrowserAnimationsModule, LoggerTestingModule],
      declarations: [KvpListItemRuleTypeComponent, KvpEditRuleComponent],
      providers: [DesignerStore, ScenarioFormBuilder],
    }).compileComponents();

    fixture = TestBed.createComponent(KvpListItemRuleTypeComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
    designerStore.selectedScenario = emptyScenario;
    const scenarioFormGroup = scenarioFormBuilder.createNewScenarioForm();
    ((scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.queryMatchRules as FormArray).push(
      new FormGroup({
        key: new FormControl('', [Validators.required, Validators.maxLength(200)]),
        value: new FormControl('', [Validators.required, Validators.maxLength(3000)]),
        type: new FormControl(RuleType.NONE, [Validators.required]),
      })
    );
    component.editRuleFormGroup = (
      (scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.queryMatchRules as FormArray
    ).at(0) as FormGroup;
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
      const testRule = faker.datatype.number({
        min: 0,
        max: Object.keys(RuleType).length - 1,
      });
      component.ruleType.setValue(testRule);
      expect(component.ruleType.value).toEqual(testRule);
    });
  });

  describe('onRemove', () => {
    it('should emit a remove event', (done) => {
      component.key.setValue(recordFirstOrDefaultKey(faker.lorem.sentence(), ''));
      component.value.setValue(recordFirstOrDefault(faker.lorem.sentence(), ''));
      component.removeKvp.subscribe(() => {
        // just check if it was called; event emitter doesn't emit anything

        // The noop expect is required because Jasmine will complain that "there are no specs found".
        // This is ok because the done() method only fires if we go into this method; if the done
        // method is not fired within 5000ms then the test will fail.
        expect(true).toBe(true);
        done();
      });
      component.onRemove();
    });
  });
});
