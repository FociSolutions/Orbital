import { Component, EventEmitter, Input, Output } from '@angular/core';
import { AbstractControl, FormGroup } from '@angular/forms';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.type';
import { JsonRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/json.condition';
import { TextRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/text.condition';
import { FormBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/form-body-rule.model';

@Component({
  selector: 'app-body-list-item-rule-type',
  templateUrl: './body-list-item-rule-type.component.html',
  styleUrls: ['./body-list-item-rule-type.component.scss'],
})
export class BodyListItemRuleTypeComponent {
  readonly ruleTypes = [
    { value: BodyRuleType.JSON, display: 'JSON' },
    { value: BodyRuleType.TEXT, display: 'Text' },
  ];

  readonly jsonRuleConditions = [
    { value: JsonRuleCondition.CONTAINS, display: 'Contains' },
    { value: JsonRuleCondition.EQUALITY, display: 'Equality' },
    { value: JsonRuleCondition.PATH, display: 'Path' },
    { value: JsonRuleCondition.SCHEMA, display: 'Schema' },
  ];

  readonly textRuleConditions = [
    { value: TextRuleCondition.STARTS_WITH, display: 'Starts With' },
    { value: TextRuleCondition.ENDS_WITH, display: 'Ends With' },
    { value: TextRuleCondition.EQUALS, display: 'Equals' },
    { value: TextRuleCondition.CONTAINS, display: 'Contains' },
  ];

  @Input() bodyEditRuleFormGroup: FormGroup;
  /**
   * The body rule to be deleted by the parent
   */
  @Output() bodyRuleRemovedEventEmitter = new EventEmitter<FormBodyRule>();

  /**
   * Gets the form control for the 'rule'
   */
  get rule(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('rule');
  }

  /**
   * Gets the value from the current body rule type
   */

  get ruleType(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('ruleType');
  }

  /**
   * Gets the value from the current body rule condition
   */
  get ruleCondition(): AbstractControl {
    return this.bodyEditRuleFormGroup.get('ruleCondition');
  }

  /**
   * Emits a removes event with the body rule for the parent to remove
   */
  onRemove() {
    const removeRule = {
      rule: { bodyrule: this.rule.value },
      ruleType: this.ruleType.value,
      ruleCondition: this.ruleCondition.value,
    };
    this.bodyRuleRemovedEventEmitter.emit(removeRule);
  }
}
