import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { FormGroup, FormControl, Validators, AbstractControl, FormArray } from '@angular/forms';
import { PolicyFormBuilder } from '../policy-form-builder/policy-form.builder';
import { recordAdd, recordFirstOrDefaultKey, recordFirstOrDefault } from 'src/app/models/record';

@Component({
  selector: 'app-policy-add',
  templateUrl: './policy-add.component.html',
  styleUrls: ['./policy-add.component.scss']
})
export class PolicyAddComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private policyToAdd = {
    attributes: {} as Record<string, string>,
    type: PolicyType.NONE
  } as Policy;
  private policyIsDuplicated = false;

  @Input() policyAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() policyAddedEventEmitter = new EventEmitter<Policy>();

  readonly policies = [{ value: PolicyType.DELAYRESPONSE, viewValue: 'Delay Response' }];

  policyAddFormGroup: FormGroup;
  constructor(private formBuilder: PolicyFormBuilder) {}
  ngOnInit() {
    const policyDuplicatedSubscription = this.policyAddedIsDuplicated.subscribe(
      isDuplicated => (this.policyIsDuplicated = isDuplicated)
    );
    this.policyAddFormGroup = new FormGroup({
      attributes: this.formBuilder.generateEmptyPolicyFormArray(),
      policyType: new FormControl(this.policyToAdd.type, [Validators.required])
    });

    const policyAttributeSubscription = (this.policyAddFormGroup.controls
      .attributes as FormArray).valueChanges.subscribe(changedAttributes => {
      this.policyIsDuplicated = false;
      if (changedAttributes.length > 0) {
        const attributePolicies = changedAttributes.map(att => {
          return att as Record<string, string>;
        });
        attributePolicies.forEach(attributeToAdd => {
          recordAdd(
            this.policyToAdd.attributes,
            recordFirstOrDefaultKey(attributeToAdd, ''),
            recordFirstOrDefault(attributeToAdd, '')
          );
        });
      }
    });

    const policyTypeSubscription = this.policyAddFormGroup.get('policyType').valueChanges.subscribe(type => {
      this.policyIsDuplicated = false;
      this.policyToAdd.type = type;
      if (type === PolicyType.DELAYRESPONSE) {
        const lengthOfArray = (this.policyAddFormGroup.controls.attributes as FormArray).length;
        (this.policyAddFormGroup.controls.attributes as FormArray).insert(
          lengthOfArray,
          this.formBuilder.generateDelayPolicyFormGroup()
        );
      }
    });

    this.subscriptions.push(policyTypeSubscription, policyDuplicatedSubscription, policyAttributeSubscription);
  }

  /**
   *
   * Gets the boolean indicating if the policy to be added is duplicated.
   */
  get isPolicyDuplicated(): boolean {
    return this.policyIsDuplicated;
  }
  /**
   * Gets the form control for the 'delay'
   */
  get delay(): AbstractControl {
    const arrayAttributes = this.policyAddFormGroup.get('attributes') as FormArray;
    const delayFormGroup = arrayAttributes.at(0) as FormGroup;
    const delaytoReturn = delayFormGroup.get('delay');
    return delaytoReturn;
  }

  /**
   * Gets the form control for the 'policyType'
   */
  get policyType(): AbstractControl {
    return this.policyAddFormGroup.get('policyType');
  }
  get attributes(): FormArray {
    return this.policyAddFormGroup.get('attributes') as FormArray;
  }

  /**
   * Controls the logic for emmiting a new addPolicy event
   */
  addPolicy(): void {
    if (this.policyAddFormGroup.valid) {
      this.policyAddedEventEmitter.emit(this.policyToAdd);
    }

    if (this.policyToAdd.type === PolicyType.NONE) {
      this.policyType.setErrors({ required: true });
      this.policyType.markAsTouched();
    }
  }

  /**
   * Determines if the policy is of type delay response.
   * @param policyChosen selected policy
   */
  isDelayPolicy(policyChosen: PolicyType): boolean {
    return policyChosen === PolicyType.DELAYRESPONSE;
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
