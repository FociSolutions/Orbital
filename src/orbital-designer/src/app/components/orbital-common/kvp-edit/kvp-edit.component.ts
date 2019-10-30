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

  /**
   * The new kvp map with the new kvp added in
   */
  savedKvpMap: Map<string, string>;

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpMapEmitter;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.savedKvpMapEmitter = new EventEmitter<Map<string, string>>();
    this.kvpMap = new Map<string, string>();
  }

  /**
   * The existing KVP map
   */
  @Input()
  set kvpMap(savedKvpMap: Map<string, string>) {
    this.savedKvpMap = savedKvpMap;
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the map
   * @param kvp The KeyValue pair being taken in from the child component to be added
   */
  addKvpToMap(kvpToAdd: KeyValue<string, string>) {
    if (!!kvpToAdd && !!kvpToAdd.key && !!kvpToAdd.value) {
      this.savedKvpMap.set(kvpToAdd.key, kvpToAdd.value);
      this.logger.debug('Adding Header Rule to Map', kvpToAdd);
    }
  }
  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the map
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpFromMap(kvpToDelete: KeyValue<string, string>) {
    if (!!kvpToDelete && !!kvpToDelete.key) {
      this.savedKvpMap.delete(kvpToDelete.key);
      this.logger.debug('Delete Header Rule from Map', kvpToDelete);
    }
  }
}
