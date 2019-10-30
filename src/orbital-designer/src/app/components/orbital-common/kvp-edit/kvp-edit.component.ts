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
   * The existing KVP map
   */
  @Input()
  set kvpMap(savedKvpMap: Map<string, string>) {
    this.savedKvpMap = savedKvpMap;
  }
  /**
   * The add and list tiles to be added in the template
   */
  @Input() addKvpTitle: string;
  @Input() listKvpTitle: string;

  /**
   * The new kvp map with the new kvp added in
   */
  savedKvpMap: Map<string, string> = new Map<string, string>();

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpMapEmitter = new EventEmitter<Map<string, string>>();

  constructor(private logger: NGXLogger) {}

  ngOnInit() {}

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the map
   * @param kvp The KeyValue pair being taken in from the child component to be added
   */
  addKvpToMap(kvpToAdd: KeyValue<string, string>) {
    this.savedKvpMap.set(kvpToAdd.key, kvpToAdd.value);
    this.logger.debug('Adding Header Rule to Map', kvpToAdd);
  }
}
