import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { CreateNewMockViewComponent } from 'src/app/components/create-new-mock-view/create-new-mock-view.component';
import { RequiredErrorStateMatcher } from '../error-matcher';
import { FormControl } from '@angular/forms';

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

  // The key and value properties binded to the template
  key: string;
  value: string;

  keyFormControl = new FormControl('');

  constructor() {}

  ngOnInit() {}

  onAdd() {
    if (!this.hasDuplicates) {
      this.kvpAdd.key = this.key;
      this.kvpAdd.value = this.value;
      this.kvp.emit(this.kvpAdd);
    }
  }

  hasDuplicates(): boolean {
    return this.kvpMap.has(this.key);
  }
}
