import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { FormGroup, AbstractControl } from '@angular/forms';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-kvp-list-item-rule-type',
  templateUrl: './kvp-list-item-rule-type.component.html',
  styleUrls: ['./kvp-list-item-rule-type.component.scss']
})
export class KvpListItemRuleTypeComponent implements OnDestroy {
  private subscriptions: Subscription[] = [];

  type: RuleType;
  rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];

  @Input() editRuleFormGroup: FormGroup;
  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<any>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairRule>();
  }

  /**
   * Gets the key from the current kvp
   */

  get key(): AbstractControl {
    return this.editRuleFormGroup.get('key');
  }

  /**
   * Gets the value from the current kvp
   */
  get value(): AbstractControl {
    return this.editRuleFormGroup.get('value');
  }

  /**
   * Gets the value from the current kvp type
   */

  get ruleType(): AbstractControl {
    return this.editRuleFormGroup.get('type');
  }

  /**
   * Emits a removes event with no value
   */
  onRemove() {
    this.removeKvp.emit();
  }

  /**
   * check if value is empty when selecting Regex as rule type
   */
  isValueEmpty() {
    if (this.editRuleFormGroup.get('type').value === RuleType.REGEX) {
      return this.editRuleFormGroup.get('value').value.trim().length === 0;
    }
    return false;
  }

  /**
   * Return true if the formgroup contains a 'duplicated' error.
   */
  isRuleDuplicated() {
    if (this.editRuleFormGroup.hasError('duplicated')) {
      return this.editRuleFormGroup.errors.duplicated;
    }
    return false;
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
