import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-kvp-edit',
  templateUrl: './kvp-edit.component.html',
  styleUrls: ['./kvp-edit.component.scss']
})
export class KvpEditComponent implements OnInit {
  /**
   * The add and list tiles to be added in the template
   */
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;
  @Input() isCaseSensitive: boolean;

  /**
   * The new kvp map with the new kvp added in
   */
  savedKvpMap: Record<string, string>;

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpMapEmitter;

  constructor(private logger: NGXLogger) {
    this.savedKvpMap = {};
    this.savedKvpMapEmitter = new EventEmitter<Record<string, string>>();
  }

  ngOnInit() { }

  /**
   * This setter calls the emitter for the savedkvpmap if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.savedKvpMapEmitter.emit(this.savedKvpMap);
      this.logger.debug('KVP map has been saved', this.savedKvpMap);
    }
  }

  /**
   * The existing KVP map
   */
  @Input()
  set kvpMap(savedKvpMap: Record<string, string>) {
    if (savedKvpMap) {
      this.savedKvpMap = savedKvpMap;
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the map
   * @param kvp The KeyValue pair being taken in from the child component to be added
   */
  addKvpToMap(kvpToAdd: KeyValue<string, string>) {
    if (!!kvpToAdd && !!kvpToAdd.key && !!kvpToAdd.value) {
      if (this.isCaseSensitive) {
        this.savedKvpMap[kvpToAdd.key] = kvpToAdd.value;
        this.logger.debug('Adding a case sensitive KVP to Map', kvpToAdd);
      } else {
        this.savedKvpMap[kvpToAdd.key.toLowerCase()] = kvpToAdd.value;
        this.logger.debug('Adding a case insensitive KVP to Map', kvpToAdd);
      }
    }
  }
  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the map
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpFromMap(kvpToDelete: KeyValue<string, string>) {
    if (!!kvpToDelete && !!kvpToDelete.key) {
      delete this.savedKvpMap[kvpToDelete.key];
      this.logger.debug('Delete Header Rule from Map', kvpToDelete);
    }
  }
}
