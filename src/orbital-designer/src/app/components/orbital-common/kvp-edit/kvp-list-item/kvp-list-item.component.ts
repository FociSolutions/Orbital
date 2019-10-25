import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';

@Component({
  selector: 'app-kvp-list-item',
  templateUrl: './kvp-list-item.component.html',
  styleUrls: ['./kvp-list-item.component.scss']
})
export class KvpListItemComponent implements OnInit {
  @Input() kvp: KeyValue<string, string>;

  key: string;
  value: string;

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

  ngOnInit() {
    this.key = this.kvp.key;
    this.value = this.kvp.value;
  }
}
