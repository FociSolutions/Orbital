import { Injectable } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { BodyRule } from '../../../../models/mock-definition/scenario/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';
import { jsonErrorType } from 'src/app/models/mock-definition/scenario/json-error-type';

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
    return this.createBodyRuleForm({ rule: {}, type: RuleType.JSONCONTAINS });
  }

  /**
   * Creates a default body rule form group
   * @param bodyRule The body rule to create the form for
   */
  createBodyRuleForm(bodyRule: BodyRule): FormGroup {
    return this.formBuilder.group({
      type: new FormControl(bodyRule.type, Validators.required),
      rule: new FormControl(bodyRule.rule, this.validateJson.bind(this)),
    });
  }

  /**
   * Checks if the JSON is valid
   * @param formControl The form control to validate against
   */
  validateJson(formControl: FormControl) {
    const jsonErrorResult = this.validJsonService.checkJSON(formControl.value);

    if (jsonErrorResult != jsonErrorType.NONE) {
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
