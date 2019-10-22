import { Component, OnInit, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import deepEqual from 'deep-equal';
import { EventEmitter } from '@angular/core';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  isValid = true;
  errorMessage = '';
  bodyRuleTypeValues = BodyRuleType;
  @Input() bodyRules: BodyRule[] = [];
  @Output() bodyRuleOutput: EventEmitter<BodyRule[]> = new EventEmitter<BodyRule[]>();

  bodyType: BodyRuleType;
  bodyValue = '';

  constructor(private logger: NGXLogger) {}

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    if (this.validateRequestMatchRulesForm()) {
      const bodyRule =
      {
        type: this.bodyType,
        rule: this.tryParseJSON(this.bodyValue)
      } as unknown as BodyRule;

      this.bodyRules.push(bodyRule);
      this.bodyType = null;
      this.bodyValue = '';
      this.logger.debug('Added body rule ', bodyRule);
      this.isValid = true;
      this.bodyRuleOutput.emit(this.bodyRules);
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
    } else if (!this.isValidJSON(this.bodyValue)) {
      this.logger.debug('The body value must be valid JSON');
      this.errorMessage = 'The body value must be valid JSON';
      return false;
    } else if (this.bodyRuleDeepEquals()) {
      this.logger.debug('The rule already exists ', this.bodyValue);
      this.errorMessage = 'The rule already exists';
      return false;
    }

    return true;
  }

  /**
   * Determines if the current body rule and value are object equivalent to the ones already added
   */
  private bodyRuleDeepEquals() {
    return this.bodyRules.find(({ rule, type }) =>
           deepEqual(rule, JSON.parse(this.bodyValue)) && deepEqual(type, this.bodyType));
  }

  /**
   * Checks if the provided JSON string is valid
   * @param json The JSON to validate
   */
  isValidJSON(json: string) {
    try {
      JSON.parse(json);
      return true;
    } catch (e) {
      return false;
    }
  }

  /**
   * Returns a valid JSON object if the JSON can be parsed, otherwise null
   * @param json The JSON to parse
   */
  tryParseJSON(json: string) {
    if (this.isValidJSON(json)) {
      return JSON.parse(json);
    }

    return null;
  }

  /**
   * Whether the body rule can be added to the list of body rules
   */
  isBodyRuleValid() {
    return !this.isValid;
  }

  ngOnInit() {}
}
