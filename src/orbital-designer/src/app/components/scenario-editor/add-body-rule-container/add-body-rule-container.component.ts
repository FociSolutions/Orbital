import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-body-rule-container',
  templateUrl: './add-body-rule-container.component.html',
  styleUrls: ['./add-body-rule-container.component.scss']
})
export class AddBodyRuleContainerComponent implements OnInit {
  @Output() bodyRulesOutput: EventEmitter<BodyRule[]>;

  bodyRulesProp: BodyRule[];

  constructor(private logger: NGXLogger) {
    this.bodyRulesOutput = new EventEmitter<BodyRule[]>();
    this.bodyRulesProp = [];
  }

  ngOnInit() {}

  /**
   * Sets the body rules
   */
  @Input()
  set bodyRules(bodyRule: BodyRule[]) {
    if (bodyRule) {
      this.bodyRulesProp = bodyRule;
    }
  }

  /**
   * Saves the body rules
   */
  @Input()
  set saveBodyRules(val: boolean) {
    if (val) {
      this.logger.debug(
        'AddBodyRuleContainerComponent:saveBodyRules: Emitting the list of body ignores',
        this.bodyRulesProp
      );
      this.bodyRulesOutput.emit(this.bodyRulesProp);
    }
  }

  /**
   * Adds a body rule to the internal array
   * @param bodyRuleToAdd The body rule to add
   */
  addBodyRule(bodyRuleToAdd: BodyRule) {
    if (!!bodyRuleToAdd.rule && !!bodyRuleToAdd.type) {
      this.logger.debug('AddBodyRuleContainer: added body rule', bodyRuleToAdd);
      this.bodyRulesProp.push(bodyRuleToAdd);
    } else {
      this.logger.debug(
        'AddBodyRuleContainer: did not add body rule because it is invalid',
        bodyRuleToAdd
      );
    }
  }

  /**
   * Triggered when a body rule is deleted
   * @param bodyRuleToDelete The body rule that was deleted
   */
  handleDeleteBodyRule(bodyRuleToDelete: BodyRule) {
    this.logger.debug('Fired delete event for body rule ', bodyRuleToDelete);

    if (bodyRuleToDelete) {
      let toOutput = [] as BodyRule[];
      toOutput = this.bodyRulesProp.filter(
        bodyRule => bodyRule !== bodyRuleToDelete
      );
      this.bodyRulesProp = toOutput;
    }
  }
}
