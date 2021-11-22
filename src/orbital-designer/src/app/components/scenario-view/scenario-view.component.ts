import { Component, OnInit, OnDestroy, Input, Output, EventEmitter } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Router } from '@angular/router';
import { NGXLogger } from 'ngx-logger';
import * as uuid from 'uuid';
import { Subscription } from 'rxjs';
import { VerbType } from 'src/app/models/verb.type';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { map } from 'rxjs/operators';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import * as HttpStatus from 'http-status-codes';
import { MatCheckboxChange } from '@angular/material/checkbox';
import { ValidationType } from 'src/app/models/mock-definition/token-validation.model';
import { state } from '@angular/animations';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit, OnDestroy {
  @Input() scenarios: Scenario[] = [];
  @Output() shouldCloneToView = new EventEmitter<Scenario>();
  private storeSubscription: Subscription;
  private _selectedMode: number;

  endpointVerb: VerbType;
  endpointPath: string;

  scenarioList: Scenario[] = [];
  filteredList: Scenario[] = [];

  errorMessage: string;
  triggerOpen: string;
  mockDefinition: MockDefinition;
  isHoveringOverMenu: boolean;
  dropdownVisible: boolean;

    modes = [
      {value: ValidationType.NONE, viewValue: "None"},
      {value: ValidationType.JWT_VALIDATION, viewValue: "JWT Validation"},
      {value: ValidationType.JWT_VALIDATION_CONTENT, viewValue: "JWT Validation and Contents"},
      {value: ValidationType.CONTENT, viewValue: "Token Contents"}
    ];

  constructor(
    private store: DesignerStore,
    private router: Router,
    private logger: NGXLogger,
    private mockDefinitionService: MockDefinitionService
  ) {
    this.store.state$.subscribe(state => {
      this.mockDefinition = state.mockDefinition;
    });
  }

  ngOnInit() {
    this.storeSubscription = this.store.state$.subscribe(state => {
      if (!!state.mockDefinition && !!state.selectedEndpoint) {
        this.endpointVerb = state.selectedEndpoint.verb;
        this.endpointPath = state.selectedEndpoint.path;
        this.scenarioList = state.mockDefinition.scenarios.filter(
          s => s.path === this.endpointPath && s.verb === this.endpointVerb
        );
        this.dropdownVisible = state.mockDefinition.tokenValidation.validate;
        this.logger.log('ScenarioViewComponent:ngOnInit: Resulting ScenarioList: ', this.scenarioList);
      }
    });

    this.errorMessage = 'No scenarios exist. Click the add button to create a new scenario.';
    if (this.scenarioList.length != 0) {
      this._selectedMode = this.scenarioList[0].tokenRule.validationType;
    }
  }

  ngOnDestroy(): void {
    this.storeSubscription.unsubscribe();
  }

  addScenario() {
    this.router.navigate(['/scenario-editor', uuid.v4()]);
  }
  /**
   * Goes back to the endpoint page
   */
  goToEndpoints() {
    this.router.navigateByUrl('/endpoint-view');
  }
  /**
   * This function takes an scenario object and return its path as a string
   * @param scenario The scenario to be converted to string
   */
  scenarioToString(scenario: Scenario): string {
    if (!!scenario && !!scenario.metadata) {
      return scenario.metadata.title;
    }
  }
  /**
   * This function takes a list of scenarios and updates it to the new list of filtered scenarios
   * @param newScenarios The list of scenarios
   */
  setFilteredList(newScenarios: Scenario[]) {
    if (newScenarios) {
      this.filteredList = newScenarios;
    }
    this.errorMessage = 'No Result(s) Found';
  }

  /**
   * Clones a scenario, and adds the -copy suffix to the name. If a scenario already exists with that suffix (and has the same name),
   * then a monotonically increasing integer will be appended such that it does not conflict with any existing scenario names.
   */
  cloneScenario(scenario: Scenario) {
    this.logger.debug(scenario);
    const observable = this.mockDefinitionService
      .cloneScenario(this.store.state.mockDefinition.metadata.title, scenario)
      .pipe(map(value => value));

    observable.subscribe(result => {
      if (result) {
        this.logger.log('Scenario successfully cloned');
      }
    });
  }

  /**
   * Gets the scenario response's status string
   */
  getScenarioResponseStatusString(scenario: Scenario) {
    try {
      return HttpStatus.getStatusText(scenario.response.status);
    } catch (Error) {
      this.logger.warn(
        `Returning unknown for scenario status as the status is invalid:
          ${scenario.response.status}`
      );
      return 'Unknown';
    }
  }

  /**
   * This method opens the dialog box when called
   */
  confirmDeleteDialog(scenario: Scenario) {
    this.triggerOpen = scenario.id;
  }

  /**
   * This method delete the scenario in the store when the user clicks on the confirm box and does nothing if the user cancels
   * the scenario deletion
   * @param confirmed boolean is true when the user clicks on confirm scenario deletion
   */
  onDialogAction(confirmed: boolean, scenario: Scenario) {
    if (confirmed) {
      this.deleteScenario(scenario);
      this.logger.debug(`Scenario ${scenario.metadata.title} deleted successfully`);
    }

    this.triggerOpen = null;
    this.logger.debug(`Scenario ${scenario.metadata.title} deletion aborted`);
  }

  /**
   * This method updates the store with the current scenario filtered out
   */
  deleteScenario(scenario: Scenario) {
    this.store.deleteScenario(scenario.id);
  }

  showDialog(scenario: Scenario) {
    return this.triggerOpen === scenario.id;
  }

  /**
   * This method sets the body text with the deletion prompt
   */
  getBodyText(scenario: Scenario): string {
    return `Are you sure you want to delete '${scenario.metadata.title.bold()}' ?`;
  }

  /**
   * Sets the default scenario to the provided scenario
   * @param scenario The scenario to make default
   */
  toggleDefaultScenario(event: MatCheckboxChange, scenario: Scenario) {
    this.scenarioList.forEach(aScenario => aScenario.defaultScenario = false);
    if (event.checked) {
      scenario.defaultScenario = true;
      this.logger.debug('Set default scenario to ', scenario);
    }
  }

  updateScenariosValidationType(mode: number) {
    this.scenarioList.forEach(scenario => {
      scenario.tokenRule.validationType = mode;
      this.store.addOrUpdateScenario(scenario);
    })
  }

  get selectedMode(): number {
    return this._selectedMode;
  }

  set selectedMode(value: number)  {
    this._selectedMode = value;
    this.updateScenariosValidationType(this.selectedMode);
  }
}
