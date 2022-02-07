import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { AbstractControl, FormArray, FormControl, FormGroup, Validators } from '@angular/forms';
import { PolicyFormBuilder } from '../policy-form-builder/policy-form.builder';
import { recordFirstOrDefault, recordFirstOrDefaultKey } from 'src/app/models/record';

@Component({
  selector: 'app-policy-add',
  templateUrl: './policy-add.component.html',
  styleUrls: ['./policy-add.component.scss'],
})
export class PolicyAddComponent implements OnInit, OnDestroy {
  /**
   * Stores the subscriptions that will be destroyed during OnDestroy
   */
  private subscriptions: Subscription[] = [];
  private policyToAdd: Policy = {
    attributes: {},
    type: PolicyType.NONE,
  };
  private policyIsDuplicated = false;

  @Input() policyAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() policyAddedEventEmitter = new EventEmitter<Policy>();

  readonly policies = [{ value: PolicyType.DELAYRESPONSE, viewValue: 'Delay Response' }];

  policyAddFormGroup: FormGroup;
  constructor(private formBuilder: PolicyFormBuilder) {}
  ngOnInit() {
    const policyDuplicatedSubscription = this.policyAddedIsDuplicated.subscribe(
      (isDuplicated) => (this.policyIsDuplicated = isDuplicated)
    );
    this.policyAddFormGroup = new FormGroup({
      attributes: this.formBuilder.generateEmptyPolicyFormArray(),
      policyType: new FormControl(this.policyToAdd.type, [Validators.required]),
    });

    const policyAttributeSubscription = this.policyAddFormGroup.controls.attributes.valueChanges.subscribe(
      (changedAttributes) => {
        this.policyIsDuplicated = false;
        if (changedAttributes.length > 0) {
          changedAttributes.forEach(
            (attributeToAdd) =>
              (this.policyToAdd.attributes[recordFirstOrDefaultKey(attributeToAdd, '')] = recordFirstOrDefault(
                attributeToAdd,
                ''
              ))
          );
        }
      }
    );

    const policyTypeSubscription = this.policyAddFormGroup.get('policyType').valueChanges.subscribe((type) => {
      this.policyIsDuplicated = false;
      this.policyToAdd.type = type;
      if (type === PolicyType.DELAYRESPONSE) {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const lengthOfArray = (this.policyAddFormGroup.controls.attributes as FormArray).length;
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
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
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    const arrayAttributes: FormArray = this.policyAddFormGroup.get('attributes') as FormArray;
    const delayFormGroup = arrayAttributes.at(0);
    const delayToReturn = delayFormGroup.get('delay');
    return delayToReturn;
  }

  /**
   * Gets the form control for the 'policyType'
   */
  get policyType(): AbstractControl {
    return this.policyAddFormGroup.get('policyType');
  }
  get attributes(): FormArray {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.policyAddFormGroup.get('attributes') as FormArray;
  }

  /**
   * Controls the logic for emitting a new addPolicy event
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
    this.subscriptions.forEach((subscription) => {
      subscription.unsubscribe();
    });
  }
}
