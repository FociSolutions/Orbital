import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { NGXLogger } from 'ngx-logger';
import { FormGroup } from '@angular/forms';
import { AddBodyRuleBuilder } from '../add-body-rule/add-body-rule-builder/add-body-rule.builder';

@Component({
  selector: 'app-body-rule-list-item',
  templateUrl: './body-rule-list-item.component.html',
  styleUrls: ['./body-rule-list-item.component.scss']
})
export class BodyRuleListItemComponent implements OnInit {
  bodyRuleTypeValues = RuleType;
  @Input() bodyRule: BodyRule;
  @Output() deletedBodyRule: EventEmitter<BodyRule>;
  bodyRuleListItemFormGroup: FormGroup;
  errorMessage: string;

  constructor(private logger: NGXLogger, private bodyRuleListItemBuilder: AddBodyRuleBuilder) {
    this.bodyRule = {} as BodyRule;
    this.deletedBodyRule = new EventEmitter<BodyRule>();
    this.bodyRuleListItemFormGroup = bodyRuleListItemBuilder.createNewBodyRuleForm();
  }

  ngOnInit() {}

  /**
   * Sends an event to delete the selected body rule
   */
  deleteBodyRule(bodyRuleToDelete: BodyRule) {
    this.logger.debug('Emitting event to delete body rule', bodyRuleToDelete);
    this.deletedBodyRule.emit(bodyRuleToDelete);
  }

  /**
   * Gets the rule from the body; returns an empty string if undefined or null
   */
  getBodyRule() {
    if (this.bodyRule.rule) {
      return JSON.stringify(this.bodyRule.rule);
    } else {
      return '';
    }
  }

  /**
   * Gets the type from the body; returns an empty string if undefined or null
   */
  getBodyType() {
    if (this.bodyRule.type) {
      return this.bodyRule.type;
    } else {
      return '';
    }
  }
}
