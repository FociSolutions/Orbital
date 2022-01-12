import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValue } from '@angular/common';
import { MatCard } from '@angular/material/card';

@Component({
  selector: 'app-kvp-list-item',
  templateUrl: './kvp-list-item.component.html',
  styleUrls: ['./kvp-list-item.component.scss'],
})
export class KvpListItemComponent {
  currentKVP: KeyValue<string, string>;

  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValue<string, string>>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValue<string, string>>();
    this.currentKVP = { key: '', value: '' };
  }

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
