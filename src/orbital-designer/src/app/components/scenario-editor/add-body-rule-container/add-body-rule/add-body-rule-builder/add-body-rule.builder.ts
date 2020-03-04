import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { defaultBodyRule, BodyRule } from '../../../../../../app/models/mock-definition/scenario/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';

@Injectable({
  providedIn: 'root'
})
export class AddBodyRuleBuilder {
  constructor(private formBuilder: FormBuilder, private validateJsonService: ValidJsonService) {}

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
      rule: new FormControl(JSON.stringify(bodyRule.rule), this.validateJson.bind(this))
    });
  }

  /**
   * Checks if the JSON is valid
   * @param c The form control to validate against
   */
  validateJson(c: FormControl) {
    return this.validateJsonService.isValidJSON(c.value) ? null : { invalidJson: true };
  }

  validateJsonPath(c: FormControl) {
    const jp = require('jsonpath');
    try {
      jp.parse(c.value);
      return null;
    } catch {
      return { invalidJsonPath: true };
    }
  }
}
