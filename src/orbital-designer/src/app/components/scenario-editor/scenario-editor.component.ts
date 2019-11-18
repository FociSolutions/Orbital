import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import { VerbType } from 'src/app/models/verb.type';

@Component({
  selector: 'app-scenario-editor',
  templateUrl: './scenario-editor.component.html',
  styleUrls: ['./scenario-editor.component.scss']
})
export class ScenarioEditorComponent implements OnInit, OnDestroy {
  readonly headerMatchRuleTitle = 'Header Match Rule';
  readonly headerMatchRuleListTitle = 'Header Rules';

  readonly queryMatchRuleTitle = 'Query Match Rule';
  readonly queryMatchRuleListTitle = 'Query Rules';

  scenarioId: string;
  selectedScenario: Scenario;
  paramsSubscription: Subscription;

  requestMatchRule: RequestMatchRule;
  metadata: Metadata;
  response: Response;

  shouldSave: boolean;
  requestMatchRuleValid = false;
  responseMatchRuleValid = false;
  metadataMatchRuleValid = false;

  triggerOpenCancelBox: boolean;

  constructor(
    private router: Router,
    private store: DesignerStore,
    private logger: NGXLogger,
    private activatedRouter: ActivatedRoute
  ) {}

  /**
   * Runs when the app is initialized
   */
  ngOnInit() {
    this.triggerOpenCancelBox = false;
    this.paramsSubscription = this.activatedRouter.params.subscribe(
      (param: Params) => {
        this.scenarioId = param.scenarioId;
        this.logger.debug(
          'ScenarioEditorComponent:ngOnInit: Retrieved Scenario ID from URL',
          param.scenarioId
        );
        this.retrieveScenario(param.scenarioId);
      }
    );
  }

  /**
   * Unsubscribes from the params subscription when the module is unloaded
   */
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
  }

  /**
   * Goes back to the scenarios view
   */
  goToScenarios() {
    this.router.navigateByUrl('scenario-view');
  }

  /*
   * Saves the metadata to the scenario editor
   * @param metadata The metadata input from the component
   */
  handleMetadataOutput(metadata: Metadata) {
    this.logger.debug('handleMetadataOutput:', metadata);
    this.metadataMatchRuleValid = !!metadata.title;
    this.metadata = metadata;
    this.saveScenario();
  }

  /**
   * Saves the request match rule in the scenario-editor component
   * @param requestMatchRule The request match rule to save
   */
  handleRequestMatchRuleOutput(requestMatchRule: RequestMatchRule) {
    this.logger.debug('handleRequestMatchRuleOutput:', requestMatchRule);
    this.requestMatchRuleValid = requestMatchRule !== ({} as RequestMatchRule);
    this.requestMatchRule = requestMatchRule;
    this.saveScenario();
  }

  saveScenario() {
    if (
      this.metadataMatchRuleValid &&
      this.requestMatchRuleValid &&
      this.responseMatchRuleValid
    ) {
      this.logger.debug('Attempting save');
      this.logger.debug(
        'Saved these fields:',
        this.metadata,
        this.requestMatchRule,
        this.response
      );
      const currentScenario = this.store.state.mockDefinition.scenarios.find(
        s => s.id === this.scenarioId
      );
      if (currentScenario) {
        this.logger.debug('Current scenario is: ', currentScenario);
        // update the store
        currentScenario.metadata = this.metadata;
        currentScenario.requestMatchRules.bodyRules = this.requestMatchRule.bodyRules;
        currentScenario.requestMatchRules.headerRules = this.requestMatchRule.headerRules;
        currentScenario.requestMatchRules.queryRules = this.requestMatchRule.queryRules;

        currentScenario.response.body = this.response.body;
        currentScenario.response.headers = this.response.headers;
        currentScenario.response.status = this.response.status;

        this.logger.debug(
          'New current scenario (after saving):',
          currentScenario
        );
      } else {
        // save a new scenario
        const newScenario = {
          id: this.scenarioId,
          metadata: JSON.parse(JSON.stringify(this.metadata)),
          requestMatchRules: JSON.parse(JSON.stringify(this.requestMatchRule)),
          response: JSON.parse(JSON.stringify(this.response)),
          verb: JSON.parse(
            JSON.stringify(this.store.state.selectedEndpoint.verb)
          ),
          path: this.store.state.selectedEndpoint.path
        } as Scenario;

        this.scenarioId = newScenario.id;

        this.store.state.mockDefinition.scenarios.push(newScenario);
        this.logger.debug(
          'Designer store after saving this scenario',
          this.store.state.mockDefinition.scenarios
        );

        this.store.state.selectedScenario = newScenario;
      }
      this.requestMatchRuleValid = false;
      this.shouldSave = false;
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
    await new Promise(resolve => setTimeout(resolve, 0));
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
    this.logger.debug(
      'User answer for scenario-editor cancel box',
      shouldCancel
    );
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

    const selected = currentMock.scenarios.find(s => s.id === scenarioId);
    if (selected) {
      this.selectedScenario = selected;
      this.logger.debug(
        'ScenarioEditorComponent:retrieveScenario: Scenario find for the provided scenario ID',
        this.selectedScenario
      );
    } else {
      const endpointVerb = this.store.state.selectedEndpoint.verb;
      const endpointPath = this.store.state.selectedEndpoint.path;
      this.selectedScenario = this.createEmptyScenario(
        scenarioId,
        endpointVerb,
        endpointPath
      );
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
  private createEmptyScenario(
    scenarioId: string,
    scenarioVerb: VerbType,
    scenarioPath: string
  ): Scenario {
    return {
      id: scenarioId,
      metadata: {} as Metadata,
      verb: scenarioVerb,
      path: scenarioPath,
      response: {
        headers: new Map<string, string>()
      } as Response,
      requestMatchRules: {
        headerRules: new Map<string, string>(),
        queryRules: new Map<string, string>(),
        bodyRules: []
      } as RequestMatchRule
    } as Scenario;
  }
}
