import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-key-value-list',
  templateUrl: './key-value-list.component.html',
  styleUrls: ['./key-value-list.component.scss']
})
export class KeyValueListComponent implements OnInit {
  @Input() keysTitle: string;
  @Input() valuesTitle: string;
  @Input() keyValueMap: Map<string, string>;
  @Input() keys: string[];
  @Input() autoCompleteKeySuggestion?: string[];
  key = '';
  val = '';

  constructor() {}

  addTuple(e: Event) {
    e.preventDefault();
    this.keyValueMap.set(this.key, this.val);
    this.key = '';
    this.val = '';
  }

  changeKey(oldKey: string, newKey: string) {
    this.keyValueMap.set(newKey, this.keyValueMap.get(oldKey));
    this.keyValueMap.delete(oldKey);
  }

  changeValue(k: string, newValue: string) {
    this.keyValueMap.set(k, newValue);
  }

  ngOnInit() {}
}
