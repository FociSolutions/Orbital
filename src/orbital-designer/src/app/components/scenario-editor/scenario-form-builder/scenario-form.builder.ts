import { Injectable } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormGroup, ValidationErrors, Validators } from '@angular/forms';
import { Scenario, emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from 'src/app/models/record';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import { Policy, defaultPolicy } from 'src/app/models/mock-definition/scenario/policy.model';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { AddBodyRuleBuilder } from '../add-body-rule-edit/add-body-rule-builder/add-body-rule.builder';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';
import { TokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';
import { UrlRule } from 'src/app/models/mock-definition/scenario/url-rule.model';
import { UrlEditRuleComponent } from '../url-edit-rule/url-edit-rule.component';

@Injectable({
  providedIn: 'root',
})
export class ScenarioFormBuilder {
  static readonly KVP_KEY_MAXLENGTH = 200;
  static readonly KVP_VALUE_MAXLENGTH = 1000;

  private scenarioForm: FormGroup;

  constructor(private formBuilder: FormBuilder, private bodyRuleFormBuilder: AddBodyRuleBuilder) {}

  /**
   * Generates a form group for a scenario with default values
   */
  createNewScenarioForm(): FormGroup {
    return this.createScenarioForm(emptyScenario);
  }

  /**
   * Generates a form group with the values provided by the scenario parameter.
   *
   * @param scenario the scenario to be used to create the form.
   */
  createScenarioForm(scenario: Scenario): FormGroup {
    this.scenarioForm = this.formBuilder.group({
      requestMatchRules: this.requestFormGroup(scenario.requestMatchRules),
      response: this.responseFormGroup(scenario.response),
      policies: this.policiesFormArray(scenario.policies),
      tokenRule: this.tokenRuleFormArray(scenario.tokenRule),
    });
    return this.scenarioForm;
  }

  /**
   * Returns a form group with values from the RequestMatchRule provided.
   *
   * @param requestMatchRules RequestMatchRules to be turned to form groups
   */
  requestFormGroup(requestMatchRules: RequestMatchRule): FormGroup {
    return this.formBuilder.group({
      headerMatchRules: this.formBuilder.array(
        requestMatchRules.headerRules.map((h) => this.getKeyValuePairFormGroup(h))
      ),
      queryMatchRules: this.formBuilder.array(
        requestMatchRules.queryRules.map((q) => this.getKeyValuePairFormGroup(q))
      ),
      urlMatchRules: this.formBuilder.array(requestMatchRules.urlRules.map((u) => this.getUrlItemFormGroup(u))),
      bodyMatchRules: this.formBuilder.array(
        requestMatchRules.bodyRules.map((u) => this.bodyRuleFormBuilder.createBodyRuleForm(u))
      ),
    });
  }

  /**
   * Returns a form group with the provided response values.
   */
  responseFormGroup(response: Response): FormGroup {
    return this.formBuilder.group({
      status: response.status,
      body: response.body,
      type: response.type,
    });
  }

  policiesFormArray(policies: Policy[]): FormArray {
    return this.formBuilder.array(policies.map((p) => this.getPolicyFormGroup(p)));
  }

  getPolicyFormGroup(policy: Policy): FormGroup | null {
    switch (policy.type) {
      case PolicyType.DELAYRESPONSE:
        return this.formBuilder.group({
          delay: [
            recordFirstOrDefault(policy.attributes, ''),
            [Validators.required, Validators.min(1), Validators.pattern('^[0-9]*$')],
          ],
          policyType: [policy.type, [Validators.required]],
        });
      case PolicyType.NONE:
        return null;
      default: {
        // Cause a type-check error if a case is missed
        const _: never = policy.type;
      }
    }
  }

  /**
   * This method will return you the key-value-pair-rule provided as a form group.
   *
   * @param urlRule KeyValuePairRule to be turned to a form group.
   */
  getUrlItemFormGroup(urlRule: UrlRule): FormGroup {
    return this.formBuilder.group({
      path: [urlRule.path, [Validators.maxLength(UrlEditRuleComponent.PATH_MAXLENGTH)]],
      type: [urlRule.type, [Validators.required]],
    });
  }

  /**
   * This method will return you the key-value-pair-rule provided as a form group.
   *
   * @param kvpRule KeyValuePairRule to be turned to a form group.
   */
  getKeyValuePairFormGroup(kvpRule: KeyValuePairRule, validators = [Validators.required]): FormGroup {
    return this.formBuilder.group({
      key: [kvpRule.key, [...validators, Validators.maxLength(ScenarioFormBuilder.KVP_KEY_MAXLENGTH)]],
      value: [kvpRule.value, [...validators, Validators.maxLength(ScenarioFormBuilder.KVP_VALUE_MAXLENGTH)]],
      type: [kvpRule.type, validators],
    });
  }

  tokenRuleFormArray(tokenRule: TokenRule): FormArray {
    tokenRule.rules ??= [];
    return new FormArray(
      tokenRule.rules.map((t) => this.getKeyValuePairFormGroup(t, [Validators.required, this.noWhiteSpaceValidator]))
    );
  }

  noWhiteSpaceValidator(this: void, control: AbstractControl): ValidationErrors {
    let error = null;
    if (/\s/.test(control.value)) {
      error = { error: 'Cannot contain whitespace' };
    }
    return error;
  }
}

interface PolicyDelayFormGroup {
  delay: string;
  policyType: number;
}

@Injectable({
  providedIn: 'root',
})
export class ScenarioFormMapper {
  /**
   * Extracts the type of the response (e.g. NONE) from the response form
   * @param responseForm The response form group to extract the type from
   */
  GetResponseTypeFromForm(responseForm: FormGroup): ResponseType {
    return responseForm.controls.type.value;
  }

  GetUrlRulesFromForm(urlMatchRules: FormArray): UrlRule[] {
    return urlMatchRules.controls.map((group: FormGroup): UrlRule => group.getRawValue());
  }

  /**
   * Transforms FormArray data into policies to be saved in the scenario
   *
   * @param policies raw policies to be transformed
   */
  GetPolicyRulesFromForm(policies: FormArray): Policy[] {
    return policies.controls.map((group: FormGroup) =>
      this.getPolicy(group.get('policyType').value, group.getRawValue())
    );
  }

  GetBodyRulesFromForm(bodyRules: FormArray): BodyRule[] {
    return bodyRules.controls.map((group: FormGroup) => group.getRawValue());
  }

  /**
   * Transforms FormGroup into the appropriate policy
   * @param policyType The type of policy
   * @param rawValue The raw FormGroup value to be transformed
   */
  private getPolicy(policyType: PolicyType, rawValue: PolicyDelayFormGroup): Policy {
    switch (policyType) {
      case PolicyType.DELAYRESPONSE:
        return {
          type: rawValue.policyType,
          attributes: { delay: rawValue.delay },
        };
      case PolicyType.NONE:
        return defaultPolicy;
      default: {
        // Cause a type-check error if a case is missed
        const _: never = policyType;
      }
    }
  }

  /**
   * Transforms FormGroup into the appropriate KeyValuePairRule
   * @param keyValuePairFormArray The key value pair rules form array to extract from
   */
  GetKeyValuePairRulesFromForm(keyValuePairFormArray: FormArray): KeyValuePairRule[] {
    return keyValuePairFormArray.controls.map((group: FormGroup): KeyValuePairRule => group.getRawValue());
  }
}
