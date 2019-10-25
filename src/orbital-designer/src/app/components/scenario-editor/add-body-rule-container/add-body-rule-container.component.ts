import { Component, OnInit, Input, Output } from '@angular/core';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-body-rule-container',
  templateUrl: './add-body-rule-container.component.html',
  styleUrls: ['./add-body-rule-container.component.scss']
})
export class AddBodyRuleContainerComponent implements OnInit {
  @Input() bodyRules: BodyRule[] = [];
  @Output() bodyRulesOutput: BodyRule[];

  shouldIgnoreBodyRule = false;

  constructor(private logger: NGXLogger) {}
  ngOnInit() {
  }

  /**
   * Adds a body rule to the internal array
   * @param bodyRuleToAdd The body rule to add
   */
  addBodyRule(bodyRuleToAdd: BodyRule) {
    this.logger.debug('AddBodyRuleContainer: added body rule', bodyRuleToAdd);
    this.bodyRules.push(bodyRuleToAdd);
  }
}
