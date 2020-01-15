import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-kvp-list-item-rule',
  templateUrl: './kvp-list-item-rule.component.html',
  styleUrls: ['./kvp-list-item-rule.component.scss']
})
export class KvpListItemRuleComponent implements OnInit {
  currentKVP: KeyValuePairType;

  get key(): string {
    return KeyValueIndexSig.getKey(this.currentKVP.rule);
  }

  get value(): string {
    return KeyValueIndexSig.getValue(this.currentKVP.rule);
  }

  get ruleType(): RuleType {
    return this.currentKVP.type;
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  set key(localKey: string) {
    this.logger.debug("SET KEY", localKey);
    this.currentKVP.rule = KeyValueIndexSig.setKey(localKey, this.currentKVP.rule);
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  set value(value: string) {
    this.currentKVP.rule = KeyValueIndexSig.setValue(value, this.currentKVP.rule);
  }

  // tslint:disable-next-line: adjacent-overload-signatures
  set ruleType(rule: RuleType) {
    this.currentKVP.type = rule;
  }

  type: RuleType;
  rules = [
    {value: RuleType.REGEX, viewValue: 'Regex'},
    {value: RuleType.TEXTSTARTSWITH, viewValue: 'Starts With'},
    {value: RuleType.TEXTENDSWITH, viewValue: 'Ends With'},
    {value: RuleType.TEXTCONTAINS, viewValue: 'Contains'},
    {value: RuleType.TEXTEQUALS, viewValue: 'Equals'},
    {value: RuleType.JSONPATH, viewValue: 'JSON Path'},
    {value: RuleType.JSONEQUALITY, viewValue: 'JSON Equality'},
    {value: RuleType.JSONCONTAINS, viewValue: 'JSON Contains'},
    {value: RuleType.JSONSCHEMA, viewValue: 'JSON Schema'},
  ];
  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValuePairType>;

  constructor(private logger: NGXLogger) {
    this.removeKvp = new EventEmitter<KeyValuePairType>();
    let kvp = {"test": "testval"};
    this.currentKVP = {type: RuleType.TEXTEQUALS, rule: kvp as KeyValueIndexSig} as KeyValuePairType;
  }

  ngOnInit() {
    this.logger.debug("GOt to here");
    this.key = "test key 2";
    this.value = "test value 2";
  }

  @Input()
  set kvp(input: KeyValuePairType) {
    if (input) {
      this.currentKVP = input;
    }
  }

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    this.removeKvp.emit(this.currentKVP);
  }
}
