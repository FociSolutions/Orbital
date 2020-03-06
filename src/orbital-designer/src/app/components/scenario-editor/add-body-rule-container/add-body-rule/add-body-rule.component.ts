import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import * as deepEqual from 'deep-equal';
import { EventEmitter } from '@angular/core';
import { ValidJsonService } from '../../../../services/valid-json/valid-json.service';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  isValid = true;
  errorMessage = '';
  bodyRuleTypeValues = RuleType;
  @Input() bodyRules: BodyRule[] = [];
  @Output() bodyRuleOutput: EventEmitter<BodyRule> = new EventEmitter<
    BodyRule
  >();

  bodyType: RuleType;
  bodyValue = '';

  constructor(
    private logger: NGXLogger,
    private jsonService: ValidJsonService
  ) {}

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    if (this.validateRequestMatchRulesForm()) {
      const bodyRule = {
        type: this.bodyType,
        rule: this.jsonService.parseJSONOrDefault<object>(this.bodyValue, {})
      } as BodyRule;

      this.bodyType = null;
      this.bodyValue = '';
      this.logger.debug('AddBodyRule: emitted body rule ', bodyRule);
      this.isValid = true;
      this.bodyRuleOutput.emit(bodyRule);
    } else {
      this.isValid = false;
    }
  }

  /**
   * Validates the request match rules form
   * @param bodyRuleType The body rule's type to validate
   */
  validateRequestMatchRulesForm() {
    if (!this.bodyType) {
      this.logger.debug('Body type is required');
      this.errorMessage = 'Body type is required';
      return false;
    } else if (!this.jsonService.isValidJSON(this.bodyValue)) {
      this.logger.debug('The body value must be valid JSON');
      this.errorMessage = 'The body value must be valid JSON';
      return false;
    } else if (!!this.bodyRules && this.bodyRuleDeepEquals()) {
      this.logger.debug('The rule already exists ', this.bodyValue);
      this.errorMessage = 'The rule already exists';
      return false;
    }

    return true;
  }

  /**
   * Determines if the current body rule and value are object equivalent to the ones already added
   */
  private bodyRuleDeepEquals(): BodyRule {
    return this.bodyRules.find(
      ({ rule, type }) =>
        deepEqual(rule, JSON.parse(this.bodyValue)) &&
        deepEqual(type, this.bodyType)
    );
  }

  /**
   * Whether the body rule can be added to the list of body rules
   */
  isBodyRuleValid() {
    return !this.isValid;
  }

  ngOnInit() {}
}
