import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import {
  recordFirstOrDefault,
  recordFirstOrDefaultKey,
  recordAdd,
  recordUpdateKeyName
} from 'src/app/models/record';

@Component({
  selector: 'app-kvp-list-item-rule-type',
  templateUrl: './kvp-list-item-rule-type.component.html',
  styleUrls: ['./kvp-list-item-rule-type.component.scss']
})
export class KvpListItemRuleTypeComponent implements OnInit {
  currentKVP: KeyValuePairRule;

  type: RuleType;
  rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' }
  ];
  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValuePairRule>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairRule>();
  }

  ngOnInit() {}

  @Input()
  set kvp(input: KeyValuePairRule) {
    if (input) {
      this.currentKVP = input;
    }
  }

  /**
   * Gets the key from the current kvp
   */

  get key(): string {
    if (!!this.currentKVP) {
      return recordFirstOrDefaultKey(this.currentKVP.rule, '');
    }
  }
  /**
   * Sets the key for the current kvp
   */

  set key(localKey: string) {
    const oldkey = recordFirstOrDefaultKey(this.currentKVP.rule, '');
    recordUpdateKeyName(this.currentKVP.rule, oldkey, localKey);
  }
  /**
   * Gets the value from the current kvp
   */
  get value(): string {
    if (!!this.currentKVP) {
      return recordFirstOrDefault(this.currentKVP.rule, '');
    }
  }

  /**
   * Sets the value for the current kvp
   */

  set value(value: string) {
    const indexKey = recordFirstOrDefaultKey(this.currentKVP.rule, '');
    this.currentKVP.rule = recordAdd(this.currentKVP.rule, indexKey, value);
  }

  /**
   * Gets the value from the current kvp type
   */

  get ruleType(): RuleType {
    if (!!this.currentKVP) {
      return this.currentKVP.type;
    }
  }

  /**
   * Sets the value for the current kvp type
   */

  set ruleType(rule: RuleType) {
    if (!!this.currentKVP) {
      this.currentKVP.type = rule;
    }
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    this.removeKvp.emit(this.currentKVP);
  }

  /**
   * check if value is empty when selecting Regex as rule type
   */
  isValueEmpty() {
    if (!!this.currentKVP && this.currentKVP.type === RuleType.REGEX) {
      return recordFirstOrDefault(this.currentKVP.rule, '').trim().length === 0;
    }
    return false;
  }
}
