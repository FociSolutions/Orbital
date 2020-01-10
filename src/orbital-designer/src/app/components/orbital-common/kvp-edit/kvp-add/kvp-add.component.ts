import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { stringify } from 'querystring';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';

@Component({
  selector: 'app-kvp-add',
  templateUrl: './kvp-add.component.html',
  styleUrls: ['./kvp-add.component.scss']
})
export class KvpAddComponent implements OnInit {
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairRule>();

  // The key and value properties that were bound to the template
  key: string;
  value: string;
  isValid: boolean;
  errorMessage: string;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.key = '';
    this.value = '';
    this.isValid = true;
    this.errorMessage = '';
  }

  /**
   * Checks to see if the kvp inputs are empty and has no duplicates already in the map and adds them to the kvpMap
   */
  onAdd() {
    if (!this.isEmpty()) {
      const kvpRuleAdd: KeyValuePairRule = {
        rule: { key: this.key.trim(), value: this.value } as KeyValue<
          string,
          string
        >,
        type: RuleType.TEXTEQUALS
      };

      this.kvp.emit(kvpRuleAdd);
      this.isValid = true;
      this.key = '';
      this.value = '';
      this.logger.debug(
        'KvpAddComponent:onAdd: KVP emitted to parent',
        kvpRuleAdd
      );
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
