import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import * as faker from 'faker';
import { PolicyComponent } from './policy.component';
import { OrbitalCommonModule } from 'src/app/components/orbital-common/orbital-common.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatCardModule } from '@angular/material/card';
import { PolicyEditComponent } from '../policy-edit/policy-edit.component';
import { PolicyAddComponent } from '../policy-add/policy-add.component';
import { DesignerStore } from 'src/app/store/designer-store';
import { emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { ScenarioFormBuilder } from '../../scenario-form-builder/scenario-form.builder';
import { FormBuilder, FormArray, FormGroup, FormControl, Validators } from '@angular/forms';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { recordFirstOrDefault } from 'src/app/models/record';
import { LoggerTestingModule } from 'ngx-logger/testing';

describe('PolicyComponent', () => {
  let component: PolicyComponent;
  let fixture: ComponentFixture<PolicyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [OrbitalCommonModule, LoggerTestingModule, BrowserAnimationsModule, MatCardModule],
      declarations: [PolicyEditComponent, PolicyAddComponent, PolicyComponent],
      providers: [DesignerStore],
    }).compileComponents();

    fixture = TestBed.createComponent(PolicyComponent);
    component = fixture.componentInstance;
    const designerStore = TestBed.get(DesignerStore) as DesignerStore;
    const scenarioFormBuilder = TestBed.get(ScenarioFormBuilder) as ScenarioFormBuilder;
    designerStore.selectedScenario = emptyScenario;
    const scenarioFormGroup = scenarioFormBuilder.createNewScenarioForm();
    component.policyFormArray = scenarioFormGroup.get('policies') as FormArray;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('PolicyComponent.deletePolicyHandler', () => {
    it('should delete the policy if its defined', () => {
      const policy = {
        type: PolicyType.DELAYRESPONSE,
        attributes: { delay: faker.datatype.number().toString() } as Record<string, string>,
      } as Policy;
      component.policyFormArray.push(
        new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policy.attributes, '0'), [
            Validators.required,
            Validators.min(1),
          ]),
          policyType: new FormControl(policy.type, [Validators.required]),
        })
      );
      component.deletePolicyHandler(0);
      expect(component.policyFormArray.length).toBe(0);
    });

    it('should delete the policy by key if there are multiple similar policies', () => {
      const randomNumber = faker.datatype.number().toString();
      // this has to have the same value for all the values to make sure that it is not deleting by value
      const policies = [
        {
          type: PolicyType.DELAYRESPONSE,
          attributes: { test: randomNumber } as Record<string, string>,
        },
        {
          type: PolicyType.DELAYRESPONSE,
          attributes: { testtwo: randomNumber } as Record<string, string>,
        },
        {
          type: PolicyType.DELAYRESPONSE,
          attributes: { testthree: randomNumber } as Record<string, string>,
        },
      ] as Policy[];

      component.policyFormArray.push(
        new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policies[0].attributes, 'delay'), [
            Validators.required,
            Validators.min(1),
          ]),
          policyType: new FormControl(policies[0].type, [Validators.required]),
        })
      );
      component.policyFormArray.push(
        new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policies[1].attributes, 'delay'), [
            Validators.required,
            Validators.min(1),
          ]),
          policyType: new FormControl(policies[1].type, [Validators.required]),
        })
      );
      component.policyFormArray.push(
        new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policies[2].attributes, 'delay'), [
            Validators.required,
            Validators.min(1),
          ]),
          policyType: new FormControl(policies[2].type, [Validators.required]),
        })
      );
      component.deletePolicyHandler(0);
      expect(component.policyFormArray.length).toBe(2);
    });
  });

  describe('PolicyComponent.addPolicyHandler', () => {
    it('should save valid policy', () => {
      const policy = {
        type: PolicyType.DELAYRESPONSE,
        attributes: { delay: faker.datatype.number().toString() } as Record<string, string>,
      } as Policy;
      component.addPolicyHandler(policy);
      expect(component.policyFormArray.length).toBe(1);
    });
  });

  it('should not save repeated policy', () => {
    const policy = {
      type: PolicyType.DELAYRESPONSE,
      attributes: { delay: faker.datatype.number().toString() } as Record<string, string>,
    } as Policy;
    const delayValue = recordFirstOrDefault(policy.attributes, '');
    const policyFormGroup = new FormGroup({
      delay: new FormControl(delayValue, [Validators.required, Validators.min(1)]),
      policyType: new FormControl(policy.type, [Validators.required]),
    });
    component.policyFormArray.push(policyFormGroup);
    component.addPolicyHandler(policy);
    expect(component.policyFormArray.length).toBe(1);
    expect(component.policyFormArray.at(0) as FormGroup).toEqual(policyFormGroup);
  });
});
