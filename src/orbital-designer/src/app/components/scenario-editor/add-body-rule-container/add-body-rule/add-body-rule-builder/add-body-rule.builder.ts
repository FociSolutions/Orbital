import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { defaultBodyRule, BodyRule } from '../../../../../../app/models/mock-definition/scenario/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

@Injectable({
  providedIn: 'root'
})
export class AddBodyRuleBuilder {
  constructor(private formBuilder: FormBuilder, private validJsonService: ValidJsonService) {}

  /**
   * Generates a form group for a body rule with default values
   */
  createNewBodyRuleForm(): FormGroup {
    return this.createBodyRuleForm(defaultBodyRule);
  }

  /**
   * Creates a default body rule form group
   * @param defaultBodyRule The default body rule to use
   */
  createBodyRuleForm(bodyRule: BodyRule): FormGroup {
    return this.formBuilder.group({
      type: new FormControl(bodyRule.type, Validators.required),
      rule: new FormControl('', this.validateJson.bind(this))
    });
  }

  /**
   * Checks if the JSON is valid
   * @param formControl The form control to validate against
   */
  validateJson(formControl: FormControl) {
    return this.validJsonService.isValidJSON(formControl.value)
      ? null
      : { invalidJson: true, message: 'The JSON is invalid' };
  }
}
