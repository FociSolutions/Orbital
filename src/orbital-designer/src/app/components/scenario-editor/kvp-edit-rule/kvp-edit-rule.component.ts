import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';

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

  /**
   * The new kvp list with the new kvp added in
   */
  @Input() savedKvpType: KeyValuePairRule[];

  /**
   * The event emitter for the savedKvpType
   */
  @Output() savedKvpEmitter: EventEmitter<KeyValuePairRule[]>;

  constructor(private logger: NGXLogger) {
    this.savedKvpEmitter = new EventEmitter<KeyValuePairRule[]>();
    this.savedKvpType = [];
  }

  ngOnInit() {}

  /**
   * This setter calls the emitter for the saved kvp list if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.savedKvpEmitter.emit(this.savedKvpType);
      this.logger.debug('KVP list has been saved', this.savedKvpType);
    }
  }

  /**
   * The existing KVP list
   */
  @Input()
  set kvpType(savedKvpType: KeyValuePairRule[]) {
    if (savedKvpType) {
      this.savedKvpType = savedKvpType;
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvp The KeyValue pair being taken in from the child component to be deleted
   */
  deleteKvpFromRule(kvpToDelete: KeyValuePairRule) {
    if (!!kvpToDelete && !!kvpToDelete.rule) {
      this.savedKvpType = this.savedKvpType.filter(
        element => element.rule !== kvpToDelete.rule
      );
      this.logger.debug('Delete Header Rule from KVP', kvpToDelete);
    }
  }
}
