import { Component, EventEmitter, Input, Output } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { recordAdd, recordDelete } from 'src/app/models/record';

@Component({
  selector: 'app-kvp-edit',
  templateUrl: './kvp-edit.component.html',
  styleUrls: ['./kvp-edit.component.scss'],
})
export class KvpEditComponent {
  /**
   * The add and list tiles to be added in the template
   */
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;
  @Input() isCaseSensitive: boolean;

  /**
   * The new kvp list with the new kvp added in
   */
  savedKvp: Record<string, string>;

  /**
   * The event emitter for the savedKvp
   */
  @Output() savedKvpEmitter;

  constructor(private logger: NGXLogger) {
    this.savedKvp = {};
    this.savedKvpEmitter = new EventEmitter<Record<string, string>>();
  }

  /**
   * This setter calls the emitter for the savedkvp if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.savedKvpEmitter.emit(this.savedKvp);
      this.logger.debug('KVP has been saved', this.savedKvp);
    }
  }

  /**
   * The existing KVP record
   */
  @Input()
  set kvp(savedKvp: Record<string, string>) {
    if (savedKvp) {
      this.savedKvp = savedKvp;
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvpToAdd The key-value pair to add
   */
  addKvp(kvpToAdd: KeyValue<string, string>) {
    if (!!kvpToAdd && !!kvpToAdd.key && !!kvpToAdd.value) {
      if (this.isCaseSensitive) {
        recordAdd(this.savedKvp, kvpToAdd.key, kvpToAdd.value);
        this.logger.debug('Adding a case sensitive KVP', kvpToAdd);
      } else {
        recordAdd(this.savedKvp, kvpToAdd.key.toLowerCase(), kvpToAdd.value);
        this.logger.debug('Adding a case insensitive KVP', kvpToAdd);
      }
    }
  }
  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvpToDelete The key-value pair to delete
   */
  deleteKvp(kvpToDelete: KeyValue<string, string>) {
    if (!!kvpToDelete && !!kvpToDelete.key) {
      recordDelete(this.savedKvp, kvpToDelete.key);
      this.logger.debug('Delete Header Rule', kvpToDelete);
    }
  }

  hasValuesAdded() {
    const keys = Object.keys(this.savedKvp);
    return keys.length > 0;
  }
}
