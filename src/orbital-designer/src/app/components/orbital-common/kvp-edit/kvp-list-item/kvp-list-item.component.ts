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

  get kvpValues() {
    if (this.kvp.key !== null && this.kvp.value !== null) {
      return this.kvp;
    }
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
    this.removeKvp.emit(this.kvpValues);
  }

  ngOnInit() {}
}
