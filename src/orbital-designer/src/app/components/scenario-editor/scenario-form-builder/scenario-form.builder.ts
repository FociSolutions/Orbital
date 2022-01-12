/* eslint-disable @typescript-eslint/no-magic-numbers */
import { Injectable } from '@angular/core';
import {
  AbstractControl,
  FormArray,
  FormBuilder,
  FormControl,
  FormGroup,
  ValidationErrors,
  Validators,
} from '@angular/forms';
import { Scenario, emptyScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault, recordFirstOrDefaultKey } from 'src/app/models/record';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';
import { AddBodyRuleBuilder } from '../add-body-rule-edit/add-body-rule-builder/add-body-rule.builder';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';
import { TokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';

@Injectable({
  providedIn: 'root',
})
export class ScenarioFormBuilder {
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
  createScenarioForm(scenario: Scenario) {
    this.scenarioForm = this.formBuilder.group({
      metadata: this.metadataFormGroup(scenario.metadata),
      requestMatchRules: this.requestMatchRulesFormGroup(scenario.requestMatchRules),
      response: this.responseFormGroup(scenario.response),
      policies: this.policiesFormArray(scenario.policies),
      tokenRule: this.tokenRuleFormArray(scenario.tokenRule),
    });
    return this.scenarioForm;
  }

  /**
   * Returns a form group with the provided response values.
   *
   */
  responseFormGroup(response: Response): FormGroup {
    return this.formBuilder.group({
      status: response.status,
      // eslint-disable-next-line @typescript-eslint/unbound-method
      headers: this.formBuilder.array,
      body: response.body,
      type: response.type,
    });
  }

  /**
   * Returns a form group with values from the RequestMatchRule provided.
   *
   * @param requestMatchRules RequestMatchRules to be turned to form groups
   */
  requestMatchRulesFormGroup(requestMatchRules: RequestMatchRule): FormGroup {
    return this.formBuilder.group({
      headerMatchRules: this.formBuilder.array(
        requestMatchRules.headerRules.map((h) => this.getHeaderOrQueryItemFormGroup(h))
      ),
      queryMatchRules: this.formBuilder.array(
        requestMatchRules.queryRules.map((q) => this.getHeaderOrQueryItemFormGroup(q))
      ),
      urlMatchRules: this.formBuilder.array(requestMatchRules.urlRules.map((u) => this.getUrlItemFormGroup(u))),
      bodyMatchRules: this.formBuilder.array(
        requestMatchRules.bodyRules.map((u) => this.bodyRuleFormBuilder.createBodyRuleForm(u))
      ),
    });
  }

  /**
   * This method will return you the metadata provided as a form group.
   *
   * @param metadata The metadata information to be turned to a form group.
   */
  metadataFormGroup(metadata: Metadata): FormGroup {
    return this.formBuilder.group({
      title: [metadata.title, [Validators.maxLength(50)]],
      description: [metadata.description, [Validators.maxLength(500)]],
    });
  }

  policiesFormArray(policies: Policy[]): FormArray {
    return this.formBuilder.array(policies.map((p) => this.getPolicyFormGroup(p)));
  }

  getPolicyFormGroup(policy: Policy): FormGroup {
    switch (policy.type) {
      case PolicyType.DELAYRESPONSE: {
        return new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policy.attributes, ''), [
            Validators.required,
            Validators.min(1),
            Validators.pattern('^[0-9]*$'),
          ]),
          policyType: new FormControl(policy.type, [Validators.required]),
        });
      }
      default:
        throw new Error('Invalid PolicyType');
    }
  }

  /**
   * This method will return you the key-value-pair-rule provided as a form group.
   *
   * @param urlRule KeyValuePairRule to be turned to a form group.
   */
  getUrlItemFormGroup(urlRule: KeyValuePairRule) {
    return new FormGroup({
      path: new FormControl(recordFirstOrDefault(urlRule.rule, ''), [Validators.required, Validators.maxLength(3000)]),
      ruleType: new FormControl(urlRule.type, [Validators.required]),
    });
  }

  /**
   * This method will return you the key-value-pair-rule provided as a form group.
   *
   * @param headerOrQueryRule KeyValuePairRule to be turned to a form group.
   */
  getHeaderOrQueryItemFormGroup(headerOrQueryRule: KeyValuePairRule, validators = [Validators.required]) {
    return new FormGroup({
      key: new FormControl(recordFirstOrDefaultKey(headerOrQueryRule.rule, ''), [
        ...validators,
        Validators.maxLength(200),
      ]),
      value: new FormControl(recordFirstOrDefault(headerOrQueryRule.rule, ''), [
        ...validators,
        Validators.maxLength(1000),
      ]),
      type: new FormControl(headerOrQueryRule.type, validators),
    });
  }

  tokenRuleFormArray(tokenRule: TokenRule): FormArray {
    tokenRule.rules ??= [];
    return new FormArray(
      tokenRule.rules.map((t) =>
        this.getHeaderOrQueryItemFormGroup(t, [
          Validators.required,
          Validators.maxLength(200),
          this.noWhiteSpaceValidator,
        ])
      )
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

  GetUrlRulesFromForm(urlMatchRules: FormArray) {
    interface UrlRuleFormGroup {
      path: string;
      ruleType: number;
    }

    const urlRules: KeyValuePairRule[] = urlMatchRules.controls
      .map((group) => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (group as FormGroup).getRawValue();
      })
      .map((urlFormGroup: UrlRuleFormGroup) => {
        return {
          type: urlFormGroup.ruleType,
          rule: { urlPath: urlFormGroup.path },
        };
      });
    return urlRules;
  }

  /**
   * Transforms FormArray data into policies to be saved in the scenario
   *
   * @param policies raw policies to be transformed
   */
  GetPolicyRulesFromForm(policies: FormArray) {
    const newPolicies: Policy[] = policies.controls.map((group) => {
      const policyType = group.get('policyType').value;
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const rawValue = (group as FormGroup).getRawValue();
      return this.getPolicy(policyType, rawValue);
    });
    return newPolicies;
  }

  GetBodyRulesFromForm(bodyRules: FormArray) {
    const newBodyRules: BodyRule[] = bodyRules.controls.map((group) => {
      // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
      const rawValue = (group as FormGroup).getRawValue();
      return this.getBodyRule(rawValue);
    });
    return newBodyRules;
  }

  /**
   * Transforms FormGroup into the appropriate policy
   * @param policyType The type of policy
   * @param rawValue The raw FormGroup value to be transformed
   */
  private getPolicy(policyType: PolicyType, rawValue: PolicyDelayFormGroup) {
    switch (policyType) {
      case PolicyType.DELAYRESPONSE: {
        const rawPolicy = rawValue;
        const policyToReturn = {
          type: rawPolicy.policyType,
          attributes: { delay: rawPolicy.delay },
        };
        return policyToReturn;
      }
      default:
        throw new Error('Invalid PolicyType');
    }
  }

  /**
   * Transforms FormGroup into the appropriate query or header rule
   * @param headerOrQueryRules The header or query rules form array to extract from
   */
  GetHeaderOrQueryRulesFromForm(headerOrQueryRules: FormArray) {
    interface HeaderQueryRuleFormGroup {
      key: string;
      value: string;
      type: number;
    }

    const kvpRules: KeyValuePairRule[] = headerOrQueryRules.controls
      .map((group): HeaderQueryRuleFormGroup => {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        return (group as FormGroup).getRawValue();
      })
      .map((kvpRuleFormGroup): KeyValuePairRule => {
        return {
          type: kvpRuleFormGroup.type,
          rule: { [kvpRuleFormGroup.key]: kvpRuleFormGroup.value },
        };
      });
    return kvpRules;
  }

  /*
   * Transforms FormGroup into the appropriate policy
   * @param rawValue The raw FormGroup value to be transformed
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getBodyRule(rawValue: any): BodyRule {
    return { rule: rawValue.rule, type: rawValue.type };
  }
}
