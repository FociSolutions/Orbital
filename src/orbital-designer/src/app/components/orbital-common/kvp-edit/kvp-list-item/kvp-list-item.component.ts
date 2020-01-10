import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';

@Component({
  selector: 'app-kvp-list-item',
  templateUrl: './kvp-list-item.component.html',
  styleUrls: ['./kvp-list-item.component.scss']
})
export class KvpListItemComponent implements OnInit {
  currentKVP: KeyValuePairRule;

  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValuePairRule>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairRule>();
    this.currentKVP = {} as KeyValuePairRule;
  }

  ngOnInit() {}

  @Input()
  set kvp(input: KeyValuePairRule) {
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
