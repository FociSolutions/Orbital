import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { EventEmitter } from '@angular/core';
import { KeyValuePairRule } from '../../../models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from '../../../models/record';
import { ScenarioEditorService } from '../services/scenario-editor.service';

@Component({
  selector: 'app-url-edit-rule',
  templateUrl: './url-edit-rule.component.html',
  styleUrls: ['./url-edit-rule.component.scss']
})
export class UrlEditRuleComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription[] = [];

  urlRules: KeyValuePairRule[];

  @Output() savedUrlEmitter: EventEmitter<KeyValuePairRule[]>;

  constructor(
    private scenarioEditorService: ScenarioEditorService,
    private logger: NGXLogger
  ) {
    this.urlRules = [];
    this.savedUrlEmitter = new EventEmitter<KeyValuePairRule[]>();
  }

  ngOnInit(): void {
    const urlSubscription = this.scenarioEditorService.urlEditRulesOnChange$.subscribe(
      rules => (this.urlRules = rules)
    );
    this.subscriptions.push(urlSubscription);
  }

  /**
   * This method listens to the event emitter from the child component and adds the KeyValue pair into the list
   * @param kvp The KeyValue pair rule being taken in from the child component to be added
   */
  addUrlEditRuleHandler(kvpToAdd: KeyValuePairRule) {
    const rulefound = this.urlRules.find(
      r =>
        recordFirstOrDefault(r.rule, '') ===
        recordFirstOrDefault(kvpToAdd.rule, '')
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
  deleteUrlEditRuleHandler(kvpToDelete: KeyValuePairRule) {
    if (!!kvpToDelete && !!kvpToDelete.rule) {
      this.urlRules = this.urlRules.filter(
        element => element.rule !== kvpToDelete.rule
      );
      this.logger.debug('Delete Path Rule from KVP', kvpToDelete);
    }
  }

  /**
   * Implementation for NG On Destroy
   */
  ngOnDestroy(): void {
    this.subscriptions.forEach(subscription => {
      subscription.unsubscribe();
    });
  }
}
