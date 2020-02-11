import { Injectable } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { Scenario, defaultScenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { recordFirstOrDefault } from 'src/app/models/record';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';

@Injectable({
  providedIn: 'root'
})
export class ScenarioFormBuilder {
  private scenarioForm: FormGroup;

  constructor(private formBuilder: FormBuilder) {}

  createNewScenarioForm(): FormGroup {
    return this.createScenarioForm(defaultScenario);
  }

  createScenarioForm(scenario: Scenario) {
    this.scenarioForm = this.formBuilder.group({
      metadata: this.metadataFormGroup(scenario.metadata),
      requestMatchRules: this.requestMatchRulesFormGroup(scenario.requestMatchRules),
      response: this.responseFormGroup()
    });
    return this.scenarioForm;
  }

  private responseFormGroup(): FormGroup {
    return this.formBuilder.group({
      statusCode: [''],
      headerRule: this.formBuilder.array,
      body: ['']
    });
  }

  public requestMatchRulesFormGroup(requestMatchRules: RequestMatchRule): FormGroup {
    return this.formBuilder.group({
      headerMatchRules: this.formBuilder.array,
      queryMatchRules: this.formBuilder.array,
      urlMatchRules: this.formBuilder.array(requestMatchRules.urlRules.map(u => this.getUrlitemFormGroup(u))),
      bodyMatchRules: this.formBuilder.array
    });
  }

  public metadataFormGroup(metadata: Metadata): FormGroup {
    return this.formBuilder.group({
      title: [metadata.title, [Validators.required, Validators.maxLength(50)]],
      description: [metadata.description, [Validators.required, Validators.maxLength(500)]]
    });
  }

  public getUrlitemFormGroup(urlRule: KeyValuePairRule) {
    return new FormGroup({
      path: new FormControl(recordFirstOrDefault(urlRule.rule, 'urlPath'), [
        Validators.required,
        Validators.maxLength(3000)
      ]),
      ruleType: new FormControl(urlRule.type, [Validators.required])
    });
  }
}
