import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-body-rule-container',
  templateUrl: './add-body-rule-container.component.html',
  styleUrls: ['./add-body-rule-container.component.scss']
})
export class AddBodyRuleContainerComponent implements OnInit {
  @Input() bodyRules: BodyRule[];
  @Output() bodyRulesOutput: EventEmitter<BodyRule[]>;

  shouldIgnoreBodyRule = false;
  private bodyRulesProp: BodyRule[];

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.bodyRules = [] as BodyRule[];
    this.bodyRulesOutput = new EventEmitter<BodyRule[]>();
    this.bodyRulesProp = [] as BodyRule[];
  }

  /**
   * Adds a body rule to the internal array
   * @param bodyRuleToAdd The body rule to add
   */
  addBodyRule(bodyRuleToAdd: BodyRule) {
    if (!!bodyRuleToAdd.rule && !!bodyRuleToAdd.type) {
      this.logger.debug('AddBodyRuleContainer: added body rule', bodyRuleToAdd);
      this.setBodyRules(bodyRuleToAdd);
    } else {
      this.logger.debug('AddBodyRuleContainer: did not add body rule because it is invalid', bodyRuleToAdd);
    }
  }

  /**
   * Triggered when a body rule is deleted
   * @param bodyRuleToDelete The body rule that was deleted
   */
  handleDeleteBodyRule(bodyRuleToDelete: BodyRule) {
    this.logger.debug('Fired delete event for body rule ', bodyRuleToDelete);

    if (!!this.bodyRules && !!bodyRuleToDelete) {
      let toOutput = [] as BodyRule[];
      toOutput = this.bodyRules.filter(bodyRule => {
        return (bodyRule !== bodyRuleToDelete);
      });
    }
  }

  setBodyRules(bodyRule: BodyRule) {
    this.bodyRulesProp.push(bodyRule);
  }

  getBodyRules() {
    return this.bodyRulesProp;
  }
}
