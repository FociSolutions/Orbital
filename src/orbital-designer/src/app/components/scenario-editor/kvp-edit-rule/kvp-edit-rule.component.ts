import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';

@Component({
  selector: 'app-kvp-edit-rule',
  templateUrl: './kvp-edit-rule.component.html',
  styleUrls: ['./kvp-edit-rule.component.scss']
})
export class KvpEditRuleComponent implements OnInit {
  /**
   * The add and list tiles to be added in the template
   */
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;
  @Input() isCaseSensitive: boolean;

  /**
   * The new kvp map with the new kvp added in
   */
  savedKvpType: KeyValuePairType[];

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpEmitter: EventEmitter<KeyValuePairType[]>;

  constructor(private logger: NGXLogger) {
    this.savedKvpEmitter = new EventEmitter<KeyValuePairType[]>();
    this.savedKvpType = [] as KeyValuePairType[];
  }

  ngOnInit() {}

  /**
   * This setter calls the emitter for the savedkvpmap if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.savedKvpEmitter.emit(this.savedKvpType);
      this.logger.debug('KVP map has been saved', this.savedKvpType);
    }
  }

  /**
   * The existing KVP map
   */
  @Input()
  set kvpType(savedKvpType: KeyValuePairType[]) {
    if (savedKvpType) {
      this.savedKvpType = savedKvpType;
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the map
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpFromRule(kvpToDelete: KeyValuePairType) {
    if (!!kvpToDelete && !!kvpToDelete.rule) {
      this.savedKvpType = this.savedKvpType.filter(
        element => element.rule !== kvpToDelete.rule
      );
      this.logger.debug('Delete Header Rule from KVP', kvpToDelete);
    }
  }
}
