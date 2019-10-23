import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger, LoggerConfig } from 'ngx-logger';

@Component({
  selector: 'app-kvp-add',
  templateUrl: './kvp-add.component.html',
  styleUrls: ['./kvp-add.component.scss']
})
export class KvpAddComponent implements OnInit {
  // The kvpMap to check duplicates on
  @Input() kvpMap: Map<string, string> = new Map<string, string>();
  // The kvp to be outputted to parent
  @Output() kvp = new EventEmitter<KeyValue<string, string>>();

  kvpAdd: KeyValue<string, string>;

  // The key and value properties that were bound to the template
  key: string;
  value: string;
  isValid: boolean;
  errorMessage: string;

  constructor(private logger: NGXLogger) {
    this.key = '';
    this.value = '';
    this.isValid = true;
    this.kvpAdd = {
      key: '',
      value: ''
    };
  }

  ngOnInit() {}

  /**
   * Checks to see if the kvp inputs are empty and has no duplicates already in the map and adds them to the kvpMap
   */
  onAdd() {
    if (!this.isEmpty() && !this.hasDuplicates()) {
      this.kvpAdd.key = this.key;
      this.kvpAdd.value = this.value;
      this.kvp.emit(this.kvpAdd);
      this.isValid = true;
      this.logger.debug('KVP emitted to parent');
    } else {
      this.isValid = false;
    }
  }

  /**
   * Returns true if the kvp has duplicates and false otherwise
   */
  hasDuplicates(): boolean {
    if (this.kvpMap.has(this.key)) {
      this.errorMessage = 'Key Value Pair Duplicates Found';
      this.logger.debug('Key Value Pair Duplicates Found');
      return true;
    } else {
      return false;
    }
  }
  /**
   * Returns true if either the key or the value fields are empty and false otherwise
   */
  isEmpty(): boolean {
    if (this.key.length <= 0 || this.value.length <= 0) {
      this.errorMessage = 'Empty Field(s) Founds: Please Enter All Values';
      this.logger.debug('Empty Field(s) Founds: Please Enter All Values');
      return true;
    } else {
      return false;
    }
  }
}
