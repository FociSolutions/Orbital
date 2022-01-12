import { Component, EventEmitter, Input, Output } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-body-list-item-rule-type',
  templateUrl: './body-list-item-rule-type.component.html',
  styleUrls: ['./body-list-item-rule-type.component.scss'],
})
export class BodyListItemRuleTypeComponent {
  readonly rules = [
    { value: RuleType.JSONPATH, viewValue: 'JSON: Path' },
    { value: RuleType.JSONCONTAINS, viewValue: 'JSON: Contains' },
    { value: RuleType.JSONEQUALITY, viewValue: 'JSON: Equality' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Text: Contains' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Text: Ends With' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Text: Equals' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Text: Starts With' },
  ];

  @Input() bodyEditRuleFormGroup: FormGroup;
  /**
   * The body rule to be deleted by the parent
   */
  @Output() bodyRuleRemovedEventEmitter = new EventEmitter<BodyRule>();

  /**
   * Gets the form control for the 'rule'
   */
  get rule(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('rule');
  }

  /**
   * Gets the value from the current body rule type
   */

  get type(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('type');
  }

  /**
   * Emits a removes event with the body rule for the parent to remove
   */
  onRemove() {
    const removeRule = {
      rule: { bodyrule: this.rule.value },
      type: this.type.value,
    };
    this.bodyRuleRemovedEventEmitter.emit(removeRule);
  }
}
