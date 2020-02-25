import { Component, OnInit, OnDestroy, Input, EventEmitter, Output } from '@angular/core';
import { Subscription } from 'rxjs';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { FormGroup, FormControl, Validators, AbstractControl } from '@angular/forms';

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
    attributes: { delay: '' } as Record<string, string>,
    type: PolicyType.NONE
  } as Policy;
  private policyIsDuplicated = false;

  @Input() policyAddedIsDuplicated = new EventEmitter<boolean>();
  @Output() policyAddedEventEmitter = new EventEmitter<Policy>();

  readonly policies = [{ value: PolicyType.DELAYRESPONSE, viewValue: 'Delay Response' }];

  policyAddFormGroup: FormGroup;
  ngOnInit() {
    const policyDuplicatedSubscription = this.policyAddedIsDuplicated.subscribe(
      isDuplicated => (this.policyIsDuplicated = isDuplicated)
    );
    this.policyAddFormGroup = new FormGroup({
      delayTime: new FormControl(this.policyToAdd.attributes['delay'], [Validators.required, Validators.min(1)]),
      policyType: new FormControl(this.policyToAdd.type, [Validators.required])
    });

    const delayTimeSubscription = this.policyAddFormGroup.get('delayTime').valueChanges.subscribe(delayTime => {
      this.policyIsDuplicated = false;
      this.policyToAdd.attributes['delay'] = delayTime.toString();
    });

    const policyTypeSubscription = this.policyAddFormGroup.get('policyType').valueChanges.subscribe(type => {
      this.policyIsDuplicated = false;
      this.policyToAdd.type = type;
    });

    this.subscriptions.push(delayTimeSubscription, policyTypeSubscription, policyDuplicatedSubscription);
  }

  /**
   *
   * Gets the boolean indicating if the policy to be added is duplicated.
   */
  get isPolicyDuplicated(): boolean {
    return this.policyIsDuplicated;
  }
  /**
   * Gets the form control for the 'delayTime'
   */
  get delayTime(): AbstractControl {
    return this.policyAddFormGroup.get('delayTime');
  }

  /**
   * Gets the form control for the 'policyType'
   */
  get policyType(): AbstractControl {
    return this.policyAddFormGroup.get('policyType');
  }

  /**
   * Controls the logic for emmiting a new addPolicy event
   */
  addPolicy(): void {
    if (this.policyAddFormGroup.valid) {
      this.policyAddedEventEmitter.emit(this.policyToAdd);
    }
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
