import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Scenario, defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault, recordAdd, recordFirstOrDefaultKey } from 'src/app/models/record';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import { ɵangular_packages_platform_browser_dynamic_testing_testing_b } from '@angular/platform-browser-dynamic/testing';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy.type';

@Injectable({
  providedIn: 'root'
})
export class ScenarioFormBuilder {
  private scenarioForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  /**
   * Generates a form group for a scenario with default values
   */
  createNewScenarioForm(): FormGroup {
    return this.createScenarioForm(defaultScenario);
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
      policies: this.policiesFormArray(scenario.policies)
    });
    return this.scenarioForm;
  }

  /**
   * Returns a form group with the provided response values.
   *
   */
  public responseFormGroup(response: Response): FormGroup {
    return this.formBuilder.group({
      statusCode: [response.status],
      headerRule: this.formBuilder.array,
      body: [response.body]
    });
  }

  /**
   * Returns a form group with values from the RequestMatchRule provided.
   *
   * @param requestMatchRules RequestMatchRules to be turned to form groups
   */
  public requestMatchRulesFormGroup(requestMatchRules: RequestMatchRule): FormGroup {
    return this.formBuilder.group({
      headerMatchRules: this.formBuilder.array(
        requestMatchRules.headerRules.map(h => this.getHeaderOrQueryItemFormGroup(h))
      ),
      queryMatchRules: this.formBuilder.array(
        requestMatchRules.queryRules.map(q => this.getHeaderOrQueryItemFormGroup(q))
      ),
      urlMatchRules: this.formBuilder.array(requestMatchRules.urlRules.map(u => this.getUrlItemFormGroup(u))),
      bodyMatchRules: this.formBuilder.array
    });
  }

  /**
   * This method will return you the metadata provided as a form group.
   *
   * @param metadata The metadata information to be turned to a form group.
   */
  public metadataFormGroup(metadata: Metadata): FormGroup {
    return this.formBuilder.group({
      title: [metadata.title, [Validators.maxLength(50)]],
      description: [metadata.description, [Validators.maxLength(500)]]
    });
  }

  public policiesFormArray(policies: Policy[]): FormArray {
    return this.formBuilder.array(policies.map(p => this.getPolicyFormGroup(p)));
  }

  public getPolicyFormGroup(policy: Policy): FormGroup {
    switch (policy.type) {
      case PolicyType.DELAYRESPONSE: {
        return new FormGroup({
          delay: new FormControl(recordFirstOrDefault(policy.attributes, ''), [
            Validators.required,
            Validators.min(1),
            Validators.pattern('^[0-9]*$')
          ]),
          policyType: new FormControl(policy.type, [Validators.required])
        });
      }
    }
  }

  /**
   * This method will return you the keyvaluepairrule provided as a form group.
   *
   * @param urlRule KeyValuePairRule to be turned to a form group.
   */
  public getUrlItemFormGroup(urlRule: KeyValuePairRule) {
    return new FormGroup({
      path: new FormControl(recordFirstOrDefault(urlRule.rule, ''), [Validators.required, Validators.maxLength(3000)]),
      ruleType: new FormControl(urlRule.type, [Validators.required])
    });
  }

  /**
   * This method will return you the keyvaluepairrule provided as a form group.
   *
   * @param headerOrQueryRule KeyValuePairRule to be turned to a form group.
   */
  public getHeaderOrQueryItemFormGroup(headerOrQueryRule: KeyValuePairRule) {
    return new FormGroup({
      key: new FormControl(recordFirstOrDefaultKey(headerOrQueryRule.rule, ''), [
        Validators.required,
        Validators.maxLength(200)
      ]),
      value: new FormControl(recordFirstOrDefault(headerOrQueryRule.rule, ''), [
        Validators.required,
        Validators.maxLength(3000)
      ]),
      type: new FormControl(headerOrQueryRule.type, [Validators.required])
    });
  }
}

@Injectable({
  providedIn: 'root'
})
export class ScenarioFormMapper {
  public GetUrlRulesFromForm(urlMatchRules: FormArray) {
    interface UrlRuleFormGroup {
      path: string;
      ruleType: number;
    }

    let urlRules: KeyValuePairRule[];

    urlRules = urlMatchRules.controls
      .map(group => {
        return (group as FormGroup).getRawValue() as UrlRuleFormGroup;
      })
      .map(urlFormGroup => {
        return {
          type: urlFormGroup.ruleType,
          rule: { urlPath: urlFormGroup.path }
        } as KeyValuePairRule;
      });
    return urlRules;
  }

  /**
   * Transforms FormArray data into policies to be saved in the scenario
   *
   * @param policies raw policies to be transformed
   */
  public GetPolicyRulesFromForm(policies: FormArray) {
    let newPolicies: Policy[];

    newPolicies = policies.controls.map(group => {
      const policytype = (group as FormGroup).get('policyType').value;
      const rawValue = (group as FormGroup).getRawValue();
      return this.getPolicy(policytype, rawValue);
    });
    return newPolicies;
  }

  /**
   * Transforms FormGroup into the appropiate policy
   * @param policytype The type of policy
   * @param rawValue The raw FormGroup value to be transformed
   */
  private getPolicy(policytype: PolicyType, rawValue: any) {
    switch (policytype) {
      case PolicyType.DELAYRESPONSE: {
        interface PolicyDelayFormGroup {
          delay: string;
          policyType: number;
        }
        const rawPolicy = rawValue as PolicyDelayFormGroup;
        const policyToReturn = {
          type: rawPolicy.policyType,
          attributes: { delay: rawPolicy.delay } as Record<string, string>
        };
        return policyToReturn;
      }
    }
  }

  /**
   * Transforms FormGroup into the appropriate query or header rule
   * @param keyValueRuleMatchRules raw rules to be transformed
   */
  public GetHeaderOrQueryRulesFromForm(headerOrQuerRules: FormArray) {
    interface HeaderQueryRuleFormGroup {
      key: string;
      value: string;
      type: number;
    }

    let kvpRules: KeyValuePairRule[];

    kvpRules = headerOrQuerRules.controls
      .map(group => {
        return (group as FormGroup).getRawValue() as HeaderQueryRuleFormGroup;
      })
      .map(kvpRuleFormGroup => {
        return {
          type: kvpRuleFormGroup.type,
          rule: { [kvpRuleFormGroup.key]: kvpRuleFormGroup.value }
        } as KeyValuePairRule;
      });
    return kvpRules;
  }
}