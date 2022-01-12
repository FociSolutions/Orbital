import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Subscription } from 'rxjs';
import { AbstractControl, FormGroup } from '@angular/forms';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';

@Component({
  selector: 'app-policy-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.scss'],
})
export class PolicyEditComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly policies = [{ value: PolicyType.DELAYRESPONSE, viewValue: 'Delay Response' }];

  @Input() policyEditFormGroup: FormGroup;
  /**
   * The policy to be deleted by the parent
   */
  @Output() policyRemovedEventEmitter = new EventEmitter<Policy>();

  ngOnInit() {
    const policyTypeSubscription = this.policyEditFormGroup.get('policyType').valueChanges.subscribe(() => {
      this.policyEditFormGroup.updateValueAndValidity();
    });

    this.subscriptions.push(policyTypeSubscription);
  }

  /**
   * Gets the form control for the 'delay'
   */
  get delay(): AbstractControl {
    return this.policyEditFormGroup.get('delay');
  }

  /**
   * Gets the value from the current policy type
   */

  get policyType(): AbstractControl {
    return this.policyEditFormGroup.get('policyType');
  }

  /**
   * Emits a removes event with the policy for the parent to remove
   */
  onRemove() {
    const removePolicy: Policy = {
      attributes: { delay: this.delay.value.toString() },
      type: this.policyType.value,
    };
    this.policyRemovedEventEmitter.emit(removePolicy);
  }

  /**
   *
   * Returns true if the policy chosen is delay response policy type
   * @param policyChosen policy type chosen
   */
  isDelayPolicy(policyChosen: PolicyType): boolean {
    return policyChosen === PolicyType.DELAYRESPONSE;
  }

  isPolicyDuplicated() {
    if (this.policyEditFormGroup.hasError('duplicated')) {
      return this.policyEditFormGroup.errors.duplicated;
    }
    return false;
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
