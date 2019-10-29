import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-kvp-list-item',
  templateUrl: './kvp-list-item.component.html',
  styleUrls: ['./kvp-list-item.component.scss']
})
export class KvpListItemComponent implements OnInit {
  // The incoming kvp to be displayed in the list
  @Input() kvp: KeyValue<string, string>;

  /**
   * kvpKey key getter method including null/undefined checks
   */
  get kvpKey() {
    if (this.kvp === null || this.kvp === undefined) {
      return '';
    }
    return this.kvp.key;
  }

  // kvpKey value getter method including null/undefined checks
  get kvpValue() {
    if (this.kvp === null || this.kvp === undefined) {
      return '';
    }
    return this.kvp.value;
  }

  // The kvp to be deleted by the parent
  @Output() removeKvp: EventEmitter<
    KeyValue<string, string>
  > = new EventEmitter<KeyValue<string, string>>();

  constructor() {}

  /**
   * Emits a removes event with the KeyValue for the parent to remove
   */
  onRemove() {
    this.removeKvp.emit(this.kvp);
  }

  ngOnInit() {}
}
