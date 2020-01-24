import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from '../../../../models/mock-definition/scenario/rule.type';

@Component({
  selector: 'app-kvp-add-rule',
  templateUrl: './kvp-add-rule.component.html',
  styleUrls: ['./kvp-add-rule.component.scss']
})
export class KvpAddRuleComponent implements OnInit {
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValue<string, string>>();

  // The key and value properties that were bound to the template
  key: string;
  value: string;
  isValid: boolean;
  errorMessage: string;

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

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.key = '';
    this.value = '';
    this.isValid = true;
    this.errorMessage = '';
  }

  /**
   * Checks to see if the kvp inputs are empty and has no duplicates already in the kvp and adds them to the kvp
   */
  onAdd() {
    if (!this.isEmpty()) {
      const kvpAdd: KeyValue<string, string> = {
        key: this.key.trim(),
        value: this.value
      };

      this.kvp.emit(kvpAdd);
      this.isValid = true;
      this.key = '';
      this.value = '';
      this.logger.debug('KvpAddComponent:onAdd: KVP emitted to parent', kvpAdd);
    } else {
      this.isValid = false;
    }
  }

  /**
   * Returns true if either the key or the value fields are empty and false otherwise
   */
  isEmpty(): boolean {
    if (this.key.trim().length === 0 || this.value.length === 0) {
      this.errorMessage = 'Empty Field(s) Found: Please Enter All Values';
      this.logger.debug('Empty Field(s) Found: Please Enter All Values');
      return true;
    } else {
      return false;
    }
  }
}
