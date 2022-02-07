import { AfterContentChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import { VerbType } from 'src/app/models/verb.type';
import * as _ from 'lodash';
import { ScenarioFormBuilder, ScenarioFormMapper } from './scenario-form-builder/scenario-form.builder';
import { FormArray, FormBuilder, FormGroup } from '@angular/forms';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';
import { MetadataFormValues } from './metadata-form/metadata-form.component';

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss'],
})
export class ScenarioEditorComponent implements OnInit, OnDestroy, AfterContentChecked {
  subscriptions: Subscription[] = [];
  // The new formGroup that the controls will be migrated into
  scenarioForm: FormGroup;

  get metadata(): FormGroup {
    // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
    return this.scenarioForm.get('metadata') as FormGroup;
  }

  scenarioId: string;
  selectedScenario: Scenario;

  requestMatchRule: RequestMatchRule;
  response: Response;

  shouldSave: boolean;
  requestMatchRuleValid = false;
  responseMatchRuleValid = false;
  tokenFormIsValid = false;

  triggerOpenCancelBox: boolean;

  endpointVerb: VerbType;
  endpointPath: string;

  /**
   * The old from group that the controls will be migrated out of
   * @deprecated Use scenarioForm instead.
   */
  scenarioFormGroup: FormGroup;

  constructor(
    private router: Router,
    private store: DesignerStore,
    private logger: NGXLogger,
    private activatedRouter: ActivatedRoute,
    private cdRef: ChangeDetectorRef,
    private formBuilder: FormBuilder,
    private oldFormBuilder: ScenarioFormBuilder,
    private scenarioFormMapper: ScenarioFormMapper
  ) {
    this.scenarioForm = this.formBuilder.group({
      metadata: [],
    });
  }

  /**
   * Runs when the app is initialized
   */
  ngOnInit() {
    this.triggerOpenCancelBox = false;
    this.subscriptions.push(
      this.activatedRouter.params.subscribe((param: Params) => {
        this.scenarioId = param.scenarioId;
        this.logger.debug('ScenarioEditorComponent:ngOnInit: Retrieved Scenario ID from URL', param.scenarioId);
        this.retrieveScenario(param.scenarioId);
        this.scenarioFormGroup = this.oldFormBuilder.createScenarioForm(this.selectedScenario);
        this.store.selectedScenario = this.selectedScenario;

        this.metadata.setValue(this.selectedScenario.metadata);
      })
    );
    this.subscriptions.push(
      this.store.state$.subscribe((state) => {
        if (state.mockDefinition && state.selectedEndpoint) {
          this.endpointVerb = state.selectedEndpoint.verb;
          this.endpointPath = state.selectedEndpoint.path;
        }
      })
    );
  }

  ngAfterContentChecked(): void {
    this.cdRef.detectChanges();
  }

  /**
   * Unsubscribes from the params subscription when the module is unloaded
   */
  ngOnDestroy() {
    this.subscriptions.forEach((s) => s.unsubscribe());
  }

  /**
   * Saves the request match rule in the scenario-editor component
   * @param requestMatchRule The request match rule to save
   */
  handleRequestMatchRuleOutput(requestMatchRule: RequestMatchRule) {
    this.logger.debug('handleRequestMatchRuleOutput:', requestMatchRule);
    this.requestMatchRuleValid = true;
    this.requestMatchRule = requestMatchRule;
    this.saveScenario();
  }

  saveScenario() {
    this.tokenFormIsValid = this.scenarioFormGroup.get('tokenRule').valid;

    this.logger.debug('saveScenario() - this.tokenFormIsValid:', this.tokenFormIsValid);
    this.logger.debug('saveScenario() - this.metadata.valid:', this.metadata.valid);
    this.logger.debug('saveScenario() - this.scenarioFormGroup.valid:', this.scenarioFormGroup.valid);
    this.logger.debug('saveScenario() - this.responseMatchRuleValid:', this.responseMatchRuleValid);

    this.logger.debug('saveScenario() - this.scenarioFormGroup.value:', this.scenarioFormGroup.value);

    if (this.metadata.valid && this.scenarioFormGroup.valid && this.responseMatchRuleValid && this.tokenFormIsValid) {
      this.logger.debug(
        'ScenarioEditorComponent:saveScenario: Attempt to update the provided scenario',
        this.selectedScenario
      );
      const newUrlRules = this.scenarioFormMapper.GetUrlRulesFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (this.scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.urlMatchRules as FormArray
      );
      const newPolicyRules = this.scenarioFormMapper.GetPolicyRulesFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.scenarioFormGroup.controls.policies as FormArray
      );
      const newHeaderRules = this.scenarioFormMapper.GetKeyValuePairRulesFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (this.scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.headerMatchRules as FormArray
      );
      const newQueryRules = this.scenarioFormMapper.GetKeyValuePairRulesFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (this.scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.queryMatchRules as FormArray
      );
      const newBodyRules = this.scenarioFormMapper.GetBodyRulesFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        (this.scenarioFormGroup.controls.requestMatchRules as FormGroup).controls.bodyMatchRules as FormArray
      );

      const newResponseType = this.scenarioFormMapper.GetResponseTypeFromForm(
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        this.scenarioFormGroup.controls.response as FormGroup
      );

      const metadata: MetadataFormValues = this.metadata.value;
      this.selectedScenario.metadata = metadata;

      this.selectedScenario.requestMatchRules.headerRules = newHeaderRules;
      this.selectedScenario.requestMatchRules.queryRules = newQueryRules;
      this.selectedScenario.requestMatchRules.bodyRules = newBodyRules;
      this.selectedScenario.requestMatchRules.urlRules = newUrlRules;
      this.selectedScenario.policies = newPolicyRules;

      this.selectedScenario.response.body = this.response.body;
      this.selectedScenario.response.headers = this.response.headers;
      this.selectedScenario.response.status = this.response.status;
      this.selectedScenario.response.type = newResponseType;

      this.store.addOrUpdateScenario(this.selectedScenario);

      this.logger.debug('ScenarioEditorComponent:saveScenario: Updated the provided scenario', this.selectedScenario);

      this.requestMatchRuleValid = false;
      this.router.navigateByUrl('/scenario-view');
    }
  }

  /*
   * Saves the response to the scenario editor
   * @param response The response input from the component
   */
  handleResponseOutput(response: Response) {
    this.logger.debug('handleResponseOutput:', response);
    this.responseMatchRuleValid = !!response.status;
    this.response = response;
    this.saveScenario();
  }

  /**
   * Saves the current scenario to the designer store
   */
  async save() {
    this.shouldSave = false;

    // this delays by 0ms, which causes the event loop to continue and
    // set the setter
    await new Promise((resolve) => setTimeout(resolve, 0));
    this.shouldSave = true;
  }

  /*
   * Opens the cancel box
   */
  cancel() {
    this.logger.debug('Opened cancel box for scenario-editor');
    this.triggerOpenCancelBox = true;
  }

  /**
   * Handles the response from the cancel box
   * @param shouldCancel The button pressed for the cancel box
   */
  onCancelDialogAction(shouldCancel: boolean) {
    this.logger.debug('User answer for scenario-editor cancel box', shouldCancel);
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
  private retrieveScenario(scenarioId: string) {
    const currentMock = this.store.state.mockDefinition;
    if (!currentMock) {
      return;
    }

    const selected = currentMock.scenarios.find((s) => s.id === scenarioId);
    if (selected) {
      this.selectedScenario = _.cloneDeep(selected);

      this.logger.debug(
        'ScenarioEditorComponent:retrieveScenario: Scenario find for the provided scenario ID',
        this.selectedScenario
      );
    } else {
      const endpointVerb = this.store.state.selectedEndpoint.verb;
      const endpointPath = this.store.state.selectedEndpoint.path;
      this.selectedScenario = this.createEmptyScenario(scenarioId, endpointVerb, endpointPath);
      this.logger.debug(
        `ScenarioEditorComponent:retrieveScenario: Scenario not find, new scenario were created for (${endpointPath}, ${endpointVerb})`,
        this.selectedScenario
      );
    }
  }

  /**
   * Create an empty scenario use the provided information
   * @param scenarioId Scenario ID of the empty scenario
   * @param scenarioVerb Verb of the scenario
   * @param scenarioPath Path of the scenario
   */
  private createEmptyScenario(scenarioId: string, scenarioVerb: VerbType, scenarioPath: string): Scenario {
    return {
      id: scenarioId,
      metadata: { title: '', description: '' },
      verb: scenarioVerb,
      path: scenarioPath,
      response: {
        headers: {},
        body: '',
        status: 200,
        type: ResponseType.CUSTOM,
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [],
        urlRules: [],
      },
      tokenRule: {
        validationType: 0,
        rules: [],
      },
      policies: [],
      defaultScenario: false,
    };
  }
}
