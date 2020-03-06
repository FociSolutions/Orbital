import { Component, OnInit, Output, EventEmitter, Input, OnDestroy } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-body-list-item-rule-type',
  templateUrl: './body-list-item-rule-type.component.html',
  styleUrls: ['./body-list-item-rule-type.component.scss']
})
export class BodyListItemRuleTypeComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  readonly rules = [
    { value: RuleType.JSONCONTAINS, viewValue: 'JSON: Contains' },
    { value: RuleType.JSONEQUALITY, viewValue: 'JSON: Equality' },
    { value: RuleType.JSONPATH, viewValue: 'JSON: Path' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Text: Contains' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Text: ends with' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Text: equals' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Text: starts with' }
  ];

  @Input() bodyEditRuleFormGroup: FormGroup;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() bodyRuleRemovedEventEmitter = new EventEmitter<KeyValuePairRule>();

  ngOnInit() {
    const ruleTypeSubscription = this.bodyEditRuleFormGroup.get('type').valueChanges.subscribe(() => {
      this.bodyEditRuleFormGroup.updateValueAndValidity();
    });

    this.subscriptions.push(ruleTypeSubscription);
  }

  /**
   * Gets the form control for the 'path'
   */
  get path(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('rule');
  }

  /**
   * Gets the value from the current body rule type
   */

  get ruleType(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('type');
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    // fill in
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
