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
  createBodyRuleForm(defaultBodyRule: BodyRule): FormGroup {
    return this.formBuilder.group({
      "bodyType": new FormControl(defaultBodyRule.type, [Validators.required, this.validateJson.bind(this)]),
      "bodyRule": new FormControl(defaultBodyRule.rule.toString())
    });
  }

  /**
   * Checks if the JSON is valid
   * @param c The form control to validate against
   */
  validateJson(c: FormControl) {
    return {validateJson: {valid: this.validateJsonService.isValidJSON(c.value)}};
  }
}
