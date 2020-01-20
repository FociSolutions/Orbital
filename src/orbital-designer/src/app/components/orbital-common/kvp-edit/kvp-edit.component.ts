import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { KeyValue } from '@angular/common';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairType } from 'src/app/models/mock-definition/scenario/key-value-pair-type.model';
import { isNgTemplate } from '@angular/compiler';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { KeyValueIndexSig } from 'src/app/models/mock-definition/scenario/key-value-index-sig.model';

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
  savedKvpRules: KeyValuePairType[];

  /**
   * The event emitter for the savedKvpMap
   */
  @Output() savedKvpMapEmitter;

  constructor(private logger: NGXLogger) {
    this.savedKvpRules = [];
    this.savedKvpMapEmitter = new EventEmitter<KeyValuePairType[]>();
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
   * The existing KVP array
   */
  @Input()
  set kvpRule(savedKvpRules: KeyValuePairType[]) {
    if (savedKvpRules) {
      this.savedKvpRules = savedKvpRules;
    }
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the map.
   * If another kvp that has the same key as the one that is being added exists, then it will overwrite it, depending
   * on the case-insensitive options.
   * @param kvp The KeyValue pair being taken in from the child component to be added
   */
  addKvpRuleToMap(kvpRuleToAdd: KeyValuePairType) {
    if (kvpRuleToAdd.rule) {
      // always set to TEXTEQUALS (for now, as the UI does not have the component implemented)
      kvpRuleToAdd.type = RuleType.TEXTEQUALS;

      if (this.isCaseSensitive) {
        // try to delete kvp if it already exists
        this.deleteKvpRuleFromMap(kvpRuleToAdd);
      } else {
        // lowercase the key
        kvpRuleToAdd.rule = KeyValueIndexSig.setKey(
          KeyValueIndexSig.getKey(kvpRuleToAdd.rule).toLowerCase(),
          kvpRuleToAdd.rule
        );

        // check if the key exists (case-insensitively) already; if so, delete it
        this.deleteKvpRuleFromMap(this.savedKvpRules.find(
          val =>
            KeyValueIndexSig.getKey(val.rule).toLowerCase() ===
            KeyValueIndexSig.getKey(kvpRuleToAdd.rule)
        ));
      }

      // unconditionally add as it has already been deleted if it exists, otherwise, it is new
      // and has to be added
      this.logger.debug(
        'Adding a case ' +
          (this.isCaseSensitive ? 'in' : '') +
          'sensitive KVP to Map',
          kvpRuleToAdd
      );
      this.savedKvpRules.push(kvpRuleToAdd);
    }
  }
  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the map
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpRuleFromMap(kvpRuleToDelete: KeyValuePairType) {
    if (!!kvpRuleToDelete && !!kvpRuleToDelete.rule) {
      this.savedKvpRules = this.savedKvpRules.filter(
        toDelete =>
          KeyValueIndexSig.getKey(toDelete.rule) !==
          KeyValueIndexSig.getKey(kvpRuleToDelete.rule)
      );
      this.logger.debug('Delete Header Rule from Map', kvpRuleToDelete);
    }
  }
}
