import { Component, OnInit, Input } from '@angular/core';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-body-rule-list-item',
  templateUrl: './body-rule-list-item.component.html',
  styleUrls: ['./body-rule-list-item.component.scss']
})
export class BodyRuleListItemComponent implements OnInit {
  bodyRuleTypeValues = BodyRuleType;
  @Input() bodyRule: BodyRule;

  constructor() {}

  ngOnInit() {
  }

  deleteBodyRule() {

  }

  /**
   * Gets the rule from the body; returns an empty string if undefined or null
   */
  getBodyRule() {
    if (!!this.bodyRule.rule) {
      return JSON.stringify(this.bodyRule.rule);
    } else {
      return '';
    }
  }

  /**
   * Gets the type from the body; returns an empty string if undefined or null
   */
  getBodyType() {
    if (!!this.bodyRule.type) {
      return this.bodyRule.type;
    } else {
      return '';
    }
  }
}
