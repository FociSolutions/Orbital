import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { RequestMatchRules } from 'src/app/models/mock-definition/scenario/request-match-rules.model';
import { VerbType } from 'src/app/models/verb-type';
import { cloneDeep } from 'lodash';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import { MetadataFormValues } from './metadata-form/metadata-form.component';
import { PolicyType } from 'src/app/models/mock-definition/scenario/policy-type';
import { PoliciesFormValues } from './policies-form/policies-form.component';
import { ResponseFormValues } from './response-form/response-form.component';
import { Response, defaultResponse } from 'src/app/models/mock-definition/scenario/response.model';
import { RequestFormValues } from './request-form/request-form.component';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';

export interface ScenarioEditorFormValues {
  metadata: MetadataFormValues;
  request: RequestFormValues;
  response: ResponseFormValues;
  policies: PoliciesFormValues;
}

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss'],
})
export class ScenarioEditorComponent implements OnInit, OnDestroy {
  subscriptions: Subscription[] = [];

  // The new formGroup that the controls will be migrated into
  scenarioForm: FormGroup;

  get metadata(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.scenarioForm.get('metadata') as FormControl;
  }

  get request(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.scenarioForm.get('request') as FormControl;
  }

  get response(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.scenarioForm.get('response') as FormControl;
  }

  get policies(): FormControl {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.scenarioForm.get('policies') as FormControl;
  }

  scenarioId: string;
  selectedScenario: Scenario;
  requestMatchRule: RequestMatchRules;
  triggerOpenCancelBox: boolean;
  endpointVerb: VerbType;
  endpointPath: string;

  constructor(
    private router: Router,
    private store: DesignerStore,
    private logger: NGXLogger,
    private activatedRoute: ActivatedRoute,
    private formBuilder: FormBuilder,
    private mockDefService: MockDefinitionService
  ) {}

  /**
   * Runs when the app is initialized
   */
  ngOnInit(): void {
    this.scenarioForm = this.formBuilder.group({
      metadata: null,
      response: null,
      request: null,
      policies: null,
    });

    this.triggerOpenCancelBox = false;

    this.subscriptions.push(
      this.activatedRoute.params.subscribe((param: Params) => {
        this.scenarioId = param.scenarioId;
        this.logger.debug('ScenarioEditorComponent:ngOnInit: Retrieved Scenario ID from URL', param.scenarioId);
        this.retrieveScenario(param.scenarioId);
        this.store.selectedScenario = this.selectedScenario;

        this.scenarioForm.setValue(this.convertScenarioToFormData(this.selectedScenario));
      }),

      this.store.state$.subscribe((state) => {
        if (state.mockDefinition && state.selectedEndpoint) {
          this.endpointVerb = state.selectedEndpoint.verb;
          this.endpointPath = state.selectedEndpoint.path;
        }
      })
    );
  }

  convertScenarioToFormData(scenario?: Scenario): ScenarioEditorFormValues {
    const response: ResponseFormValues = this.convertResponseDataToFormValues(scenario?.response ?? defaultResponse);
    const policies: PoliciesFormValues = this.convertPoliciesDataToFormValues(scenario?.policies ?? []);
    return {
      metadata: scenario?.metadata ?? null,
      request: {
        requestMatchRules: scenario?.requestMatchRules ?? null,
        tokenRules: scenario?.tokenRule.rules ?? [],
      },
      response,
      policies,
    };
  }

  convertResponseDataToFormValues(response: Response): ResponseFormValues {
    if (response.type === ResponseType.NONE) {
      response.type = ResponseType.CUSTOM;
    }
    return response;
  }

  convertPoliciesDataToFormValues(policies: Policy[]): PoliciesFormValues {
    return policies
      .map((p) => {
        switch (p.type) {
          case PolicyType.DELAY_RESPONSE:
            return p;
          case PolicyType.NONE:
          default: {
            const _: PolicyType.NONE = p.type;
            return null;
          }
        }
      })
      .filter((p) => p !== null);
  }

  ngOnDestroy(): void {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  save(): void {
    this.logger.debug('save() - form validity:', {
      scenarioForm: this.scenarioForm.valid,
      metadata: this.metadata.valid,
      request: this.request.valid,
      response: this.response.valid,
      policies: this.policies.valid,
    });

    this.logger.debug('save() - this.scenarioForm.value:', this.scenarioForm.value);

    if (this.scenarioForm.valid) {
      this.logger.debug(
        'ScenarioEditorComponent:saveScenario: Attempt to update the provided scenario',
        this.selectedScenario
      );

      const formData: ScenarioEditorFormValues = this.scenarioForm.value;
      this.insertFormDataIntoScenario(formData, this.selectedScenario);

      this.store.addOrUpdateScenario(this.selectedScenario);

      this.logger.debug('ScenarioEditorComponent:saveScenario: Updated the provided scenario', this.selectedScenario);

      this.router.navigateByUrl('/scenario-view');
    }
  }

  insertFormDataIntoScenario(formData: ScenarioEditorFormValues, scenario: Scenario) {
    scenario.metadata = formData.metadata;
    scenario.requestMatchRules = formData.request.requestMatchRules;
    scenario.tokenRule.rules = formData.request.tokenRules;
    scenario.response = formData.response;
    scenario.policies = formData.policies;
  }

  /*
   * Opens the cancel box
   */
  cancel(): void {
    this.logger.debug('Opened cancel box for scenario-editor');
    this.triggerOpenCancelBox = true;
  }

  /**
   * Handles the response from the cancel box
   * @param shouldCancel The button pressed for the cancel box
   */
  onCancelDialogAction(shouldCancel: boolean): void {
    this.logger.debug('User answer for scenario-editor cancel box:', shouldCancel);
    this.triggerOpenCancelBox = false;
    if (shouldCancel) {
      this.logger.debug('The user has cancelled; navigating to endpoint-view');
      this.router.navigateByUrl('/scenario-view');
    }
  }

  /**
   * Retrieve scenario from store using the provided scenario ID;
   * If not found, create a new empty scenario
   * @param scenarioId Scenario ID
   */
  private retrieveScenario(scenarioId: string): void {
    const currentMock = this.store.state.mockDefinition;
    if (!currentMock) {
      return;
    }

    const selected = currentMock.scenarios.find((s) => s.id === scenarioId);
    if (selected) {
      this.selectedScenario = cloneDeep(selected);

      this.logger.debug(
        'ScenarioEditorComponent:retrieveScenario: Scenario found for the provided scenario ID',
        this.selectedScenario
      );
    } else {
      const endpointVerb = this.store.state.selectedEndpoint.verb;
      const endpointPath = this.store.state.selectedEndpoint.path;
      this.selectedScenario = this.createEmptyScenario(scenarioId, endpointVerb, endpointPath);
      this.logger.debug(
        `ScenarioEditorComponent:retrieveScenario: Scenario not found, new scenario was created for (${endpointPath}, ${endpointVerb})`,
        this.selectedScenario
      );
    }
  }

  /**
   * Create an empty scenario using the provided information
   * @param id Scenario ID of the empty scenario
   * @param verb Verb of the scenario
   * @param path Path of the scenario
   */
  private createEmptyScenario(id: string, verb: VerbType, path: string): Scenario {
    const newScenario: Scenario = this.mockDefService.generateNewScenario({
      title: '',
      description: '',
      path,
      verb,
      status: 200,
    });
    newScenario.id = id;
    return newScenario;
  }
}
