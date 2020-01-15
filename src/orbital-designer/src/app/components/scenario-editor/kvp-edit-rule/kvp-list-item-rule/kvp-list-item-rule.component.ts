import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';

@Component({
  selector: 'app-kvp-list-item-rule',
  templateUrl: './kvp-list-item-rule.component.html',
  styleUrls: ['./kvp-list-item-rule.component.scss']
})
export class KvpListItemRuleComponent implements OnInit {
  currentKVP: KeyValuePairRule;

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
  @Output() removeKvp: EventEmitter<KeyValuePairRule>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairRule>();
    this.currentKVP = {type: RuleType.TEXTEQUALS, rule: { key: '', value: '' } as KeyValue<string, string>};
  }

  ngOnInit() {}

  @Input()
  set kvp(input: KeyValuePairRule) {
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
