import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl, FormArray } from '@angular/forms';
import { Scenario, defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from 'src/app/models/record';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';

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
      response: this.responseFormGroup(scenario.response)
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
      headerMatchRules: this.formBuilder.array,
      queryMatchRules: this.formBuilder.array,
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
}
