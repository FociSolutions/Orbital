import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Subscription } from 'rxjs';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';

@Component({
  selector: 'app-policy-edit',
  templateUrl: './policy-edit.component.html',
  styleUrls: ['./policy-edit.component.scss']
})
export class PolicyEditComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly policies = [{ value: PolicyType.DELAYRESPONSE, viewValue: 'Delay Response' }];

  @Input() policyEditRuleFormGroup: FormGroup;
  /**
   * The policy to be deleted by the parent
   */
  @Output() policyRemovedEventEmitter = new EventEmitter<Policy>();

  ngOnInit() {
    const policyTypeSubscription = this.policyEditRuleFormGroup.get('policyType').valueChanges.subscribe(type => {
      this.policyEditRuleFormGroup.updateValueAndValidity();
    });

    this.subscriptions.push(policyTypeSubscription);
  }

  /**
   * Gets the form control for the 'path'
   */
  get delayTime(): AbstractControl {
    return this.policyEditRuleFormGroup.get('delayTime');
  }

  /**
   * Gets the value from the current url rule type
   */

  get policyType(): AbstractControl {
    return this.policyEditRuleFormGroup.get('policyType');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    const removeRule = {
      attributes: { delay: this.delayTime.value.toString() },
      type: this.policyType.value
    } as Policy;
    this.policyRemovedEventEmitter.emit(removeRule);
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
