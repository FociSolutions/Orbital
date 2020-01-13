import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { isNgTemplate } from '@angular/compiler';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';

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
  savedKvpRules: KeyValuePairRule[];

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpMapEmitter;

  constructor(private logger: NGXLogger) {
    this.savedKvpRules = [];
    this.savedKvpMapEmitter = new EventEmitter<KeyValuePairRule[]>();
  }

  ngOnInit() {}

  /**
   * This setter calls the emitter for the savedkvpmap if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.savedKvpMapEmitter.emit(this.savedKvpRules);
      this.logger.debug('KVP map has been saved', this.savedKvpRules);
    }
  }

  /**
   * The existing KVP map
   */
  @Input()
  set kvpMap(savedKvpRules: KeyValuePairRule[]) {
    if (savedKvpRules) {
      this.savedKvpRules = savedKvpRules;
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the map
   * @param kvp The KeyValue pair being taken in from the child component to be added
   */
  addKvpRuleToMap(kvpRuleToAdd: KeyValuePairRule) {
    if (
      this.savedKvpRules.length !== 0 ||
      !this.savedKvpRules
        .map(item => item.rule.key)
        .includes(kvpRuleToAdd.rule.key)
    ) {
      kvpRuleToAdd.type = RuleType.TEXTEQUALS;

      if (this.isCaseSensitive) {
        this.savedKvpRules.push(kvpRuleToAdd);
        this.logger.debug('Adding a case sensitive KVP to Map', kvpRuleToAdd);
      } else {
        kvpRuleToAdd.rule.key.toLowerCase();
        this.savedKvpRules.push(kvpRuleToAdd);
        this.logger.debug('Adding a case insensitive KVP to Map', kvpRuleToAdd);
      }
    } else {
      this.deleteKvpRuleFromMap(kvpRuleToAdd);
      this.addKvpRuleToMap(kvpRuleToAdd);
    }
  }
  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the map
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpRuleFromMap(kvpRuleToDelete: KeyValuePairRule) {
    if (
      this.savedKvpRules
        .map(item => item.rule.key)
        .includes(kvpRuleToDelete.rule.key)
    ) {
      this.savedKvpRules = this.savedKvpRules.filter(
        toDelete => toDelete.rule.key !== kvpRuleToDelete.rule.key
      );
      this.logger.debug('Delete Header Rule from Map', kvpRuleToDelete);
    }
  }
}
