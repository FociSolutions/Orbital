import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

@Component({
  selector: 'app-kvp-list-item-rule-type',
  templateUrl: './kvp-list-item-rule-type.component.html',
  styleUrls: ['./kvp-list-item-rule-type.component.scss']
})
export class KvpListItemRuleTypeComponent implements OnInit {
  currentKVP: KeyValuePairType;

  type: RuleType;
  rules = [
    { value: RuleType.REGEX, viewValue: 'Regex' },
    { value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With' },
    { value: RuleType.TEXTENDSWITH, viewValue: 'Ends With' },
    { value: RuleType.TEXTCONTAINS, viewValue: 'Contains' },
    { value: RuleType.TEXTEQUALS, viewValue: 'Equals' },
    { value: RuleType.JSONPATH, viewValue: 'JSON Path' },
    { value: RuleType.JSONEQUALITY, viewValue: 'JSON Equality' },
    { value: RuleType.JSONCONTAINS, viewValue: 'JSON Contains' },
    { value: RuleType.JSONSCHEMA, viewValue: 'JSON Schema' }
  ];
  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValuePairType>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairType>();
  }

  ngOnInit() {}

  @Input()
  set kvp(input: KeyValuePairType) {
    if (input) {
      this.currentKVP = input;
    }
  }

  /**
   * Gets the key from the current kvp
   */

  get key(): string {
    return KeyValueIndexSig.getKey(this.currentKVP.rule);
  }
  /**
   * Sets the key for the current kvp
   */

  set key(localKey: string) {
    this.currentKVP.rule = KeyValueIndexSig.setKey(
      localKey,
      this.currentKVP.rule
    );
  }
  /**
   * Gets the value from the current kvp
   */
  get value(): string {
    return KeyValueIndexSig.getValue(this.currentKVP.rule);
  }

  /**
   * Sets the value for the current kvp
   */

  set value(value: string) {
    this.currentKVP.rule = KeyValueIndexSig.setValue(
      value,
      this.currentKVP.rule
    );
  }

  /**
   * Gets the value from the current kvp type
   */

  get ruleType(): RuleType {
    return this.currentKVP.type;
  }

  /**
   * Sets the value for the current kvp type
   */

  set ruleType(rule: RuleType) {
    this.currentKVP.type = rule;
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    this.removeKvp.emit(this.currentKVP);
  }
}
