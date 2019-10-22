import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import deepEqual from 'deep-equal';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  isValid = true;
  errorMessage = '';
  bodyRules: BodyRule[] = [];

  bodyType: BodyRuleType;
  bodyValue = '';

  constructor(private logger: NGXLogger) {}

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    const bodyRuleType = this.bodyType;

    if (this.validateRequestMatchRulesForm()) {
      const bodyRule =
      {
        type: bodyRuleType,
        rule: this.tryParseJSON(this.bodyValue)
      } as unknown as BodyRule;

      this.bodyRules.push(bodyRule);
      this.bodyType = null;
      this.bodyValue = '';
      this.logger.debug('Added body rule ', bodyRule);
      this.isValid = true;
    } else {
      this.isValid = false;
    }
  }

  /**
   * Validates the request match rules form
   * @param bodyRuleType The body rule's type to validate
   */
  validateRequestMatchRulesForm() {
    if (this.bodyValue === null) {
      this.errorMessage = 'The JSON object is not valid';
      this.logger.debug('A validation error occured and the body rule could not be added ', this.bodyValue);
      return false;
    } else if (this.bodyValue === '') {
      this.errorMessage = 'The body rule value is required';
      this.logger.debug('The body rule value is required ', this.bodyValue);
      return false;
    } else if (!this.isValidJSON(this.bodyValue)) {
      this.logger.debug('The body value must be valid JSON');
      this.errorMessage = 'The body value must be valid JSON';
      return false;
    } else if (this.bodyRuleDeepEquals()) {
      this.logger.debug('The rule already exists ', this.bodyValue);
      this.errorMessage = 'The rule already exists';
      return false;
    } else if (!this.bodyType) {
      this.logger.debug('Body type is required');
      this.errorMessage = 'Body type is required';
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

  /**
   * Fired when the body type dropdown is changed
   * @param event The selected body type
   */
  onChangeUpdateBodyType(event: BodyRuleType) {
    this.bodyType = event;
  }

  ngOnInit() {}
}
