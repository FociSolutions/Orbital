import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, Params, ActivatedRoute } from '@angular/router';
import { FormGroup, FormControl, Validators, FormArray } from '@angular/forms';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';
import { Subscription } from 'rxjs';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { RequestMatchRule } from 'src/app/models/mock-definition/scenario/request-match-rule.model';
import { Response } from 'src/app/models/mock-definition/scenario/response.model';
import * as uuid from 'uuid';
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
  nameAndDescriptionFormGroup: FormGroup;
  name: FormControl;
  description: FormControl;
  nameDescriptionPanelExpanded: boolean;

  responseFormGroup: FormGroup;
  requestMatchRulesPanelExpanded: boolean;

  selectedScenario: Scenario;
  paramsSubscription: Subscription;
  scenarioId: string;
  requestMatchRule: RequestMatchRule;

  metadata: Metadata;
  response: Response;

  shouldSave: boolean;
  requestMatchRuleValid = false;
  responseMatchRuleValid = false;
  metadataMatchRuleValid = false;

  constructor(
    private router: Router,
    private store: DesignerStore,
    private logger: NGXLogger,
    private activatedRouter: ActivatedRoute
  ) {
    this.selectedScenario = this.store.selectedScenario;
    this.logger.debug('Selected scenario:', this.store.selectedScenario);

    this.nameAndDescriptionFormGroup = new FormGroup({
      name: new FormControl(
        '',
        Validators.compose([Validators.maxLength(50), Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.maxLength(50)])
      )
    });

    this.responseFormGroup = new FormGroup({
      status: new FormGroup({
        statuscode: new FormControl(
          '',
          Validators.compose([
            Validators.maxLength(3),
            Validators.required,
            Validators.pattern('^[0-9]*$')
          ])
        )
      }),
      headers: new FormGroup({
        headerToAdd: new FormGroup({
          key: new FormControl(),
          value: new FormControl()
        }),
        headersAdded: new FormArray([
          new FormGroup({
            key: new FormControl(),
            value: new FormControl()
          }),
          new FormGroup({
            key: new FormControl(),
            value: new FormControl()
          })
        ])
      }),
      body: new FormGroup({
        bodyContent: new FormControl()
      })
    });
  }

  /**
   * Runs when the app is initialized
   */
  ngOnInit() {
    this.paramsSubscription = this.activatedRouter.params.subscribe(
      (param: Params) => {
        this.scenarioId = param.scenarioId;
        this.logger.debug('Scenario id from URL:', this.scenarioId);
        if (this.store.state.mockDefinition) {
          this.selectedScenario = this.store.state.mockDefinition.scenarios.find(
            s => s.id === this.scenarioId
          );
          this.logger.debug(
            'New selected scenario from the URL: ',
            this.selectedScenario
          );
        }
      }
    );
  }

  /**
   * Goes back to the scenarios view
   */
  goToScenarios() {
    this.router.navigateByUrl('scenario-view');
  }

  /**
   * Sets the state of the panel to collapsed when cancel is clicked
   */
  handleCancelButtonClick() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Sets the state of the panel to collapsed when save is clicked.
   * Currently, this method is identical to handleCancelButtonClick but will
   * contain save functionality later.
   */
  handleSaveButtonClick() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Sets the state of the panel to open
   */
  handleNameDescriptionPanelOpen() {
    this.nameDescriptionPanelExpanded = true;
  }

  /**
   * Returns whether the save button should be disabled based on the form's validity
   */
  saveButtonDisabledState() {
    if (
      !!this.nameAndDescriptionFormGroup &&
      this.nameAndDescriptionFormGroup.controls.name !== undefined &&
      this.nameAndDescriptionFormGroup.controls.description !== undefined
    ) {
      return (
        this.nameAndDescriptionFormGroup.controls.name.invalid ||
        this.nameAndDescriptionFormGroup.controls.description.invalid
      );
    }

    return true;
  }

  /**
   * Handles when the panel is manually closed (by clicking the header.)
   */
  handleNameDescriptionPanelClose() {
    this.nameDescriptionPanelExpanded = false;
  }

  /**
   * Handles when the request match rules panel is open
   */
  handleRequestMatchRulesPanelOpen() {
    this.requestMatchRulesPanelExpanded = true;
  }

  /**
   * Handles when the request match panel is closed
   */
  handleRequestMatchRulesPanelClose() {
    this.requestMatchRulesPanelExpanded = false;
  }

  /**
   * Handles when the cancel button is clicked on the request match rules
   */
  handleCancelButtonClickRequestMatchRules() {
    this.requestMatchRulesPanelExpanded = false;
  }

  /**
   * Handles when the save button is clicked on the request match rules
   */
  saveButtonDisabledStateRequestMatchRules() {
    if (!!this.responseFormGroup) {
      return this.responseFormGroup.invalid;
    }

    return true;
  }

  /**
   * Handles when the save button is clicked on the request match rules
   */
  handleSaveButtonClickRequestMatchRules() {
    this.requestMatchRulesPanelExpanded = true;
  }

  /**
   * Unsubscribes from the params subscription when the module is unloaded
   */
  ngOnDestroy() {
    this.paramsSubscription.unsubscribe();
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
        currentScenario.metadata = JSON.parse(JSON.stringify(this.metadata));
        currentScenario.requestMatchRules = JSON.parse(
          JSON.stringify(this.requestMatchRule)
        );
        currentScenario.response = JSON.parse(JSON.stringify(this.response));
        this.logger.debug(
          'New current scenario (after saving):',
          currentScenario
        );
      } else {
        // save a new scenario
        const newScenario = {
          id: uuid.v4(),
          metadata: JSON.parse(JSON.stringify(this.metadata)),
          requestMatchRules: JSON.parse(JSON.stringify(this.requestMatchRule)),
          response: JSON.parse(JSON.stringify(this.response)),
          verb: JSON.parse(JSON.stringify(VerbType.GET)), // FIXME
          path: 'fix-me'
        } as Scenario;

        this.scenarioId = newScenario.id;

        this.store.state.mockDefinition.scenarios.push(newScenario);
        this.logger.debug(
          'Designer store after saving this scenario',
          this.store.state.mockDefinition.scenarios
        );
      }
      this.requestMatchRuleValid = false;
      this.shouldSave = false;
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
  save() {
    this.shouldSave = true;
  }
}
