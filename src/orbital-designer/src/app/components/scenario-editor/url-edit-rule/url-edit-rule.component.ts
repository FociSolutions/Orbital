import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { EventEmitter } from '@angular/core';
import * as deepEqual from 'deep-equal';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefaultKey } from '../../../models/record';

@Component({
  selector: 'app-url-edit-rule',
  templateUrl: './url-edit-rule.component.html',
  styleUrls: ['./url-edit-rule.component.scss']
})
export class UrlEditRuleComponent implements OnInit {
  isValid = true;
  errorMessage = '';
  urlRuleTypeValues = RuleType;
  @Input() urlRules: KeyValuePairRule[] = [];

  /**
   * The add and list tiles to be added in the template
   */
  @Input() addUrlTitle: string;

  @Output() urlRuleOutput: EventEmitter<KeyValuePairRule[]> = new EventEmitter<
  KeyValuePairRule[]>();

  urlType: RuleType;
  urlValue = '';
  constructor(
    private logger: NGXLogger,
  ) {
    this.urlRules = [];
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addKvp(kvpToAdd: KeyValuePairRule) {
    const rulefound = this.urlRules.find(
      r =>
        recordFirstOrDefaultKey(r.rule, '') ===
        recordFirstOrDefaultKey(kvpToAdd.rule, '')
    );
    if (!rulefound) {
      this.urlRules.push(kvpToAdd);
      this.logger.debug('UrlEditRuleComponent: ', this.urlRules);
    }
  }

  /**
   * This method listens to the event emitter from the child component and deletes the KeyValue pair from the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be deleted
   */
  deleteKvpFromRule(kvpToDelete: KeyValuePairRule) {
    if (!!kvpToDelete && !!kvpToDelete.rule) {
      this.urlRules = this.urlRules.filter(
        element => element.rule !== kvpToDelete.rule
      );
      this.logger.debug('Delete Path Rule from KVP', kvpToDelete);
    }
  }

  /**
   * The existing KVP list
   */
  @Input()
  set kvpType(urlRules: KeyValuePairRule[]) {
    if (urlRules) {
      this.urlRules = urlRules;
    }
  }

  /**
   * This setter calls the emitter for the saved kvp list if shouldSave is true
   */
  @Input()
  set Save(shouldSave: boolean) {
    if (shouldSave) {
      this.urlRuleOutput.emit(this.urlRules);
      this.logger.debug('URL list has been saved', this.urlRules);
    }
  }

  /**
   * Whether the url rule can be added to the list of url rules
   */
  isUrlRuleValid() {
    return !this.isValid;
  }

  ngOnInit() {
  }

}
