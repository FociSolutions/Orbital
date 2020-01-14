import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-kvp-list-item-rule',
  templateUrl: './kvp-list-item-rule.component.html',
  styleUrls: ['./kvp-list-item-rule.component.scss']
})
export class KvpListItemRuleComponent implements OnInit {
  currentKVP: KeyValue<string, string>;

  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValue<string, string>>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValue<string, string>>();
    this.currentKVP = { key: '', value: '' };
  }

  ngOnInit() {}

  @Input()
  set kvp(input: KeyValue<string, string>) {
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
