import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

@Component({
  selector: 'app-kvp-list-item',
  templateUrl: './kvp-list-item.component.html',
  styleUrls: ['./kvp-list-item.component.scss']
})
export class KvpListItemComponent implements OnInit {
  currentKVP: KeyValuePairType;

  /**
   * The kvp to be deleted by the parent
   */
  @Output() removeKvp: EventEmitter<KeyValuePairType>;

  constructor() {
    this.removeKvp = new EventEmitter<KeyValuePairType>();
    this.currentKVP = {
      type: 0,
      rule: {
        '': ''
      }
    } as KeyValuePairType;
  }

  ngOnInit() {}

  /**
   * Gets the key from the currentKVP
   */
  get key() {
    return KeyValueIndexSig.getKey(this.currentKVP.rule);
  }

  /**
   * Sets the current KVP
   */
  @Input()
  set kvp(input: KeyValuePairType) {
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
