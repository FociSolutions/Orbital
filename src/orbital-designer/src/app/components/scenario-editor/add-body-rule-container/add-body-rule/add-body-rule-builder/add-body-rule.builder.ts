import { Injectable } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { defaultBodyRule, BodyRule } from '../../../../../../app/models/mock-definition/scenario/body-rule.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { RuleType } from 'src/app/models/mock-definition/scenario/rule.type';

@Injectable({
  providedIn: 'root'
})
export class AddBodyRuleBuilder {
  constructor(private formBuilder: FormBuilder, private validJsonService: ValidJsonService) {}

  /**
   * Generates a form group for a body rule with default values
   */
  createNewBodyRuleForm(): FormGroup {
    // the default body rule's rule is none, but the designer mockup does not have an option for none
    // specify a different default with the "ACCEPT ALL" type instead
    return this.createBodyRuleForm({rule: {}, type: RuleType.ACCEPTALL} as BodyRule);
  }

  /**
   * Creates a default body rule form group
   * @param defaultBodyRule The default body rule to use
   */
  createBodyRuleForm(bodyRule: BodyRule): FormGroup {
    return this.formBuilder.group({
      type: new FormControl(bodyRule.type, Validators.required),
      rule: new FormControl(
        this.validJsonService.parseJSONOrDefault(JSON.stringify(bodyRule.rule), ''),
        this.validateJson.bind(this)
      )
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
