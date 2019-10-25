import { Component, OnInit, Input, Output } from '@angular/core';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-body-rule-container',
  templateUrl: './add-body-rule-container.component.html',
  styleUrls: ['./add-body-rule-container.component.scss']
})
export class AddBodyRuleContainerComponent implements OnInit {
  @Input() bodyRules: BodyRule[];
  @Output() bodyRulesOutput: BodyRule[];

  shouldIgnoreBodyRule = false;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
    this.bodyRulesOutput = [] as BodyRule[];
    this.bodyRules = [] as BodyRule[];
  }

  /**
   * Adds a body rule to the internal array
   * @param bodyRuleToAdd The body rule to add
   */
  addBodyRule(bodyRuleToAdd: BodyRule) {
    if (!!bodyRuleToAdd.rule && !!bodyRuleToAdd.type) {
      this.logger.debug('AddBodyRuleContainer: added body rule', bodyRuleToAdd);
      this.bodyRules.push(bodyRuleToAdd);
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
      const toOutput = [] as BodyRule[];
      this.bodyRules.forEach(bodyRule => {
        // WORKAROUND: use JSON.stringify instead of deepEquals, as deepEquals throws an exception
        if (JSON.stringify(bodyRule) !== JSON.stringify(bodyRuleToDelete)) {
          toOutput.push(bodyRule);
        }
      });
      this.bodyRulesOutput = toOutput;
    }
  }

}
