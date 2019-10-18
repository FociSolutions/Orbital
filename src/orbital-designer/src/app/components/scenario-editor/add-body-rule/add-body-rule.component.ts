import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { NGXLogger } from 'ngx-logger';
import { jsonValidator } from 'src/app/validators/json-validator/json-validator';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

@Component({
  selector: 'app-add-body-rule',
  templateUrl: './add-body-rule.component.html',
  styleUrls: ['./add-body-rule.component.scss']
})
export class AddBodyRuleComponent implements OnInit {
  public addBodyRuleFormGroup: FormGroup;
  errorMessage: string;
  bodyRules: BodyRule[] = [];

  constructor(private logger: NGXLogger) {
    this.addBodyRuleFormGroup = new FormGroup({
      bodyType: new FormControl(
        '',
        extendBuiltInValidatorFactory(
          Validators.compose([Validators.required]),
          logger
        )
      ),
      bodyValue: new FormControl({value: '', disabled: false})
    });

    // ensure that the body value is valid JSON
    this.addBodyRuleFormGroup.get('bodyValue').setValidators([
      Validators.required,
      jsonValidator()
    ]);
  }

  /**
   * Adds the body rule from the form field into the internal array
   */
  addBodyRule() {
    const bodyType = this.addBodyRuleFormGroup.controls.bodyType.value;
    const bodyValue = this.addBodyRuleFormGroup.controls.bodyValue.value;
    let bodyRuleType: BodyRuleType;
    switch (bodyType) {
      case 'bodyIgnore':
        bodyRuleType = BodyRuleType.BodyIgnore;
        break;
      case 'bodyContains':
        bodyRuleType = BodyRuleType.BodyContains;
        break;
      case 'bodyEquality':
        bodyRuleType = BodyRuleType.BodyEquality;
    }

    const bodyRule =
    {
      type: bodyRuleType,
      rule: JSON.parse(bodyValue)
    } as unknown as BodyRule;

    // conditionally add body rule if it does not exist
    if (!this.bodyRules.find(({ rule, type }) => rule === bodyRule.rule && type === bodyRule.type)) {
      this.bodyRules.push(bodyRule);
      this.addBodyRuleFormGroup.reset();
      this.logger.debug('Added body rule ', bodyRule);
    } else {
      this.addBodyRuleFormGroup.get('bodyValue').setErrors({ruleExists: true});
      this.getBodyValidationErrorMessages();
      this.logger.debug('Cannot add body rule because it already exists ', bodyRule);
    }
  }

  /**
   * Whether to disable adding the body rule button (to prevent adding invalid data)
   */
  shouldDisableAddingBodyRuleButton() {
    return !this.addBodyRuleFormGroup.valid;
  }

  /**
   * Gets the error messages for the body's value
   */
  getBodyValidationErrorMessages() {
    const bodyValueErrors = this.addBodyRuleFormGroup.get('bodyValue').errors;
    if (bodyValueErrors != null) {
      this.logger.debug('Body value errors ', this.addBodyRuleFormGroup.get('bodyValue').errors);
      if (bodyValueErrors.required) {
        this.errorMessage = 'This field is required';
      } else if (bodyValueErrors.jsonInvalid) {
        this.errorMessage = 'The JSON object is not valid';
      } else if (bodyValueErrors.ruleExists) {
        this.errorMessage = 'The rule already exists';
      } else {
        this.errorMessage = '';
      }
    }
  }

  ngOnInit() {}
}
