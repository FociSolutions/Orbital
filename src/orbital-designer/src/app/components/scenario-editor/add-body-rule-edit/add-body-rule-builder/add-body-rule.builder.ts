import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BodyRule } from '../../../../models/mock-definition/scenario/body-rule/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { jsonErrorType } from 'src/app/models/mock-definition/scenario/json-error-type';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { TextBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/text-body-rule.model';
import { JsonBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/json-body-rule.model';
import { TextRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/text.condition';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule/body-rule.type';
import { JsonRuleCondition } from 'src/app/models/mock-definition/scenario/body-rule/rule-condition/json.condition';
import { FormBodyRule } from 'src/app/models/mock-definition/scenario/body-rule/rule-type/form-body-rule.model';

function isBodyRule(item: unknown): item is BodyRule {
  return Object.keys(item).includes('type');
}

@Injectable({
  providedIn: 'root',
})
export class AddBodyRuleBuilder {
  constructor(private formBuilder: FormBuilder, private validJsonService: ValidJsonService) {}

  /**
   * Generates a form group for a body rule with default values
   */
  createNewBodyRuleForm(): FormGroup {
    // the default body rule's rule is none, but the designer mockup does not have an option for none
    // specify a different default with the "ACCEPT ALL" type instead
    return this.createBodyRuleForm({
      rule: {},
      type: RuleType.JSONCONTAINS,
    });
  }

  /**
   * Creates a default body rule form group
   * @param bodyRule The body rule to create the form for
   */
  createBodyRuleForm(bodyRule: BodyRule | FormBodyRule): FormGroup {
    let ruleType: FormBodyRule['ruleType'];
    let ruleCondition: FormBodyRule['ruleCondition'];

    if (isBodyRule(bodyRule)) {
      const ruleData = this.convertBodyRuleToBodyRuleType(bodyRule);
      ruleType = ruleData.ruleType;
      ruleCondition = ruleData.ruleCondition;
    } else {
      ruleType = bodyRule.ruleType;
      ruleCondition = bodyRule.ruleCondition;
    }

    return this.formBuilder.group({
      rule: new FormControl(bodyRule.rule, this.validateJson.bind(this)),
      ruleType: new FormControl(ruleType, Validators.required),
      ruleCondition: new FormControl(ruleCondition, Validators.required),
    });
  }

  convertBodyRuleToBodyRuleType(rule: BodyRule): Omit<TextBodyRule, 'rule'> | Omit<JsonBodyRule, 'rule'> {
    switch (rule.type) {
      case RuleType.NONE:
      case RuleType.REGEX:
      case RuleType.ACCEPTALL:
      case RuleType.JSONCONTAINS:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.CONTAINS };
      case RuleType.JSONEQUALITY:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.EQUALITY };
      case RuleType.JSONPATH:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.PATH };
      case RuleType.JSONSCHEMA:
        return { ruleType: BodyRuleType.JSON, ruleCondition: JsonRuleCondition.SCHEMA };
      case RuleType.TEXTCONTAINS:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.CONTAINS };
      case RuleType.TEXTEQUALS:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.EQUALS };
      case RuleType.TEXTSTARTSWITH:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.STARTS_WITH };
      case RuleType.TEXTENDSWITH:
        return { ruleType: BodyRuleType.TEXT, ruleCondition: TextRuleCondition.ENDS_WITH };
      default: {
        const _: never = rule.type;
      }
    }
  }

  /**
   * Checks if the JSON is valid
   * @param formControl The form control to validate against
   */
  validateJson(formControl: FormControl) {
    const jsonErrorResult = this.validJsonService.checkJSON(formControl.value);

    if (jsonErrorResult !== jsonErrorType.NONE) {
      return this.jsonInvalid(`Body rule ${this.validJsonService.jsonErrorMap.get(jsonErrorResult)}`);
    }
    return null;
  }

  /**
   *
   * @param errorMessage the error message
   * @returns the error object for a form control
   */
  jsonInvalid(errorMessage: string) {
    return { invalidJSON: true, message: errorMessage };
  }
}
