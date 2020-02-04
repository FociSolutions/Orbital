import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from '../../../../models/mock-definition/scenario/key-value-pair-rule.model';
import {
  recordFirstOrDefaultKey,
  recordFirstOrDefault,
  recordAdd
} from '../../../../models/record';

@Component({
  selector: 'app-url-list-item-rule-type',
  templateUrl: './url-list-item-rule-type.component.html',
  styleUrls: ['./url-list-item-rule-type.component.scss']
})
export class UrlListItemRuleTypeComponent implements OnInit {
  currentKVP: KeyValuePairRule;

  rules = [
    { value: RuleType.REGEX, viewValue: 'Matches Regex' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.ACCEPTALL, viewValue: 'Accept All' }
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
    if (this.ruleTypeisAcceptAll()) {
      value = '';
    }
    const indexKey = recordFirstOrDefaultKey(this.currentKVP.rule, '');
    this.currentKVP.rule = recordAdd(this.currentKVP.rule, indexKey, value);
  }

  /**
   * Gets the value from the current url rule type
   */

  get ruleType(): RuleType {
    if (!!this.currentKVP) {
      return this.currentKVP.type;
    }
  }

  /**
   * Sets the value for the current url rule type
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
    if (!!this.currentKVP && this.currentKVP.type !== RuleType.ACCEPTALL) {
      return recordFirstOrDefault(this.currentKVP.rule, '').trim().length === 0;
    }
    return false;
  }

  /**
   * This will return true if the rule type is AcceptAll. false otherwise.
   */
  ruleTypeisAcceptAll(): boolean {
    if (!!this.currentKVP && this.currentKVP.type === RuleType.ACCEPTALL) {
      return true;
    }
    return false;
  }
}
