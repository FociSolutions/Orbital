import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss']
})
export class UrlListItemRuleTypeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
  ];

  @Input() index: number;
  @Input() urlEditRuleFormGroup: FormGroup;
  @Input() ruleIsDuplicatedIndex = new EventEmitter<number>();
  private urlruleIsDuplicated = false;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() urlRuleRemovedEventEmitter = new EventEmitter<KeyValuePairRule>();
  @Output() checkIfRuleIsDuplicatedEmitter = new EventEmitter();

  ngOnInit() {
    const ruleTypeSubscription = this.urlEditRuleFormGroup.get('ruleType').valueChanges.subscribe(type => {
      if (type === RuleType.ACCEPTALL) {
        this.path.disable();
        this.path.setValue('');
      } else {
        this.path.enable();
      }
      this.ruleType.setErrors(null);
      this.urlruleIsDuplicated = false;
      this.checkIfRuleIsDuplicatedEmitter.emit();
    });

    const pathSubscription = this.urlEditRuleFormGroup.get('path').valueChanges.subscribe(type => {
      this.urlruleIsDuplicated = false;
      this.checkIfRuleIsDuplicatedEmitter.emit();
    });

    if (this.urlEditRuleFormGroup.controls.ruleType.value === RuleType.ACCEPTALL) {
      this.path.disable();
    }

    const urlDuplicatedSubscription = this.ruleIsDuplicatedIndex.subscribe(
      isDuplicatedindex => (this.urlruleIsDuplicated = isDuplicatedindex === this.index)
    );

    this.subscriptions.push(ruleTypeSubscription, urlDuplicatedSubscription, pathSubscription);
  }

  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.urlEditRuleFormGroup.get('path');
  }

  /**
   * Gets the value from the current url rule type
   */

  get ruleType(): AbstractControl {
    return this.urlEditRuleFormGroup.get('ruleType');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    const removeRule = {
      rule: { urlPath: this.path.value },
      type: this.ruleType.value
    } as KeyValuePairRule;
    this.urlRuleRemovedEventEmitter.emit(removeRule);
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }

  get isDuplicatedExistingRule(): boolean {
    if (this.urlruleIsDuplicated) {
      this.urlEditRuleFormGroup.get('ruleType').setErrors({ incorrect: true });
      return this.urlruleIsDuplicated;
    }
  }
}
