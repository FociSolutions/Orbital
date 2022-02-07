import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { FormArray, FormGroup } from '@angular/forms';
import { NGXLogger } from 'ngx-logger';
import { compareRecords } from 'src/app/models/record';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { ScenarioFormBuilder } from '../../scenario-form-builder/scenario-form.builder';
import { cloneDeep } from 'lodash';
@Component({
  selector: 'app-policy',
  templateUrl: './policy.component.html',
  styleUrls: ['./policy.component.scss'],
})
export class PolicyComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  @Output() policyIsDuplicated: EventEmitter<boolean>;
  @Input() policyFormArray: FormArray;
  constructor(private logger: NGXLogger, private formBuilder: ScenarioFormBuilder) {
    this.policyIsDuplicated = new EventEmitter<boolean>();
    this.policyIsDuplicated.emit(false);
  }

  ngOnInit(): void {
    const policyFormArraySubscription = this.policyFormArray.valueChanges.subscribe((_policies) => {
      this.logger.debug('PolicyComponent checking for duplicate policies : ', this.policyFormArray);
      this.checkForDuplicates();
    });
    this.subscriptions.push(policyFormArraySubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the policy into the list
   * @param policyToAdd The policy being taken in from the child component to be added
   */
  addPolicyHandler(policyToAdd: Policy) {
    const policyFound = this.isPolicyDuplicate(policyToAdd);
    if (!policyFound) {
      this.policyIsDuplicated.emit(false);
      const index = this.policyFormArray.length;
      const newPolicyControl = this.formBuilder.getPolicyFormGroup(policyToAdd);
      this.policyFormArray.insert(index, newPolicyControl);
      this.logger.debug('PolicyComponent new rule added : ', policyToAdd);
    } else {
      this.policyIsDuplicated.emit(true);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the policy from the list
   * @param indexPosition The index position of the policy to be deleted
   */
  deletePolicyHandler(indexPosition: number) {
    this.policyFormArray.removeAt(indexPosition);
    this.logger.debug('Delete Policy from list at index: ', indexPosition);
  }

  /**
   * checks if the policy is inside the current form array
   * @param policyToAdd The policy to be added to form array
   */
  private isPolicyDuplicate(policyToAdd: Policy): boolean {
    return this.policyFormArray.controls
      .map((group) => {
        const formGroupsToCheck = cloneDeep(group);
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const policyFormGroup = this.generatePoliciesAttributes(formGroupsToCheck as FormGroup);
        return policyFormGroup;
      })
      .some((policyFormGroup) => {
        return (
          compareRecords(policyFormGroup.attributes, policyToAdd.attributes) &&
          policyFormGroup.policyType === policyToAdd.type
        );
      });
  }

  /**
   *
   * Double check to confirm there are no duplicates in the list of existing policies
   */
  private checkForDuplicates(): void {
    this.policyFormArray.controls.forEach((c) => c.setErrors(null));
    this.policyFormArray.markAsUntouched();
    const policies = this.policyFormArray.controls.map((group) => {
      const formGroupsToCheck = cloneDeep(group);
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const policyFormGroup = this.generatePoliciesAttributes(formGroupsToCheck as FormGroup);
      return policyFormGroup;
    });
    policies.forEach((policyToCheck, indexToCheck) => {
      policies.forEach((policyToCheckAgainst, indexToCheckAgainst) => {
        const foundDuplicate =
          compareRecords(policyToCheck.attributes, policyToCheckAgainst.attributes) &&
          policyToCheck.policyType === policyToCheckAgainst.policyType &&
          indexToCheck !== indexToCheckAgainst;
        if (foundDuplicate) {
          this.logger.error('PolicyComponent: found duplicate', policyToCheck);
          this.policyFormArray.at(indexToCheck).get('policyType').markAsTouched();
          this.policyFormArray.at(indexToCheckAgainst).get('policyType').markAsTouched();
          this.policyFormArray.at(indexToCheckAgainst).setErrors({ duplicated: true });
          this.policyFormArray.at(indexToCheck).setErrors({ duplicated: true });
          this.policyFormArray.setErrors({ duplicated: true });
        }
      });
    });
  }

  private generatePoliciesAttributes(group: FormGroup) {
    interface IPolicyFormGroup {
      attributes: Record<string, string>;
      policyType: number;
    }
    const attributes = {};
    Object.keys(group.controls).forEach((key) => {
      if (key !== 'policyType') {
        attributes[key] = group.controls[key].value;
      }
    });
    const policyFormGroup: IPolicyFormGroup = {
      policyType: group.controls.policyType.value,
      attributes,
    };
    return policyFormGroup;
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
