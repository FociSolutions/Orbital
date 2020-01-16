import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';

@Component({
  selector: 'app-kvp-add-rule',
  templateUrl: './kvp-add-rule.component.html',
  styleUrls: ['./kvp-add-rule.component.scss']
})

export class KvpAddRuleComponent implements OnInit {
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePairType>();

  // The key and value properties that were bound to the template
  key: string;
  value: string;
  isValid: boolean;
  errorMessage: string;

  selectedValue: string;

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
      let kvp = {};
      kvp[this.key.trim()] = this.value;
      const kvpAdd: KeyValuePairType = {
        type: RuleType.TEXTEQUALS,
        rule: kvp
      };

      this.kvp.emit(kvpAdd);
      this.isValid = true;
      this.key = '';
      this.value = '';
      this.logger.debug('KvpAddRuleComponent:onAdd: KVP emitted to parent', kvpAdd);
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
