import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePair } from 'src/app/models/mock-definition/scenario/key-value-pair.model';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

@Component({
  selector: 'app-kvp-add',
  templateUrl: './kvp-add.component.html',
  styleUrls: ['./kvp-add.component.scss']
})
export class KvpAddComponent implements OnInit {
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValuePair>();

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
      const kvpRuleAdd: KeyValuePair = {
        rule: {} as KeyValueIndexSig
      };

      kvpRuleAdd.rule[this.key.trim()] = this.value;

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
