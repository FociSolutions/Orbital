import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import * as HttpStatus from 'http-status-codes';

@Component({
  selector: 'app-scenario-list',
  templateUrl: './scenario-list.component.html',
  styleUrls: ['./scenario-list.component.scss']
})
export class ScenarioListComponent implements OnInit {
  @Input() scenarios: Scenario[] = [];
  @Output() shouldCloneToView = new EventEmitter<Scenario>();

  triggerOpen: boolean;
  mockDefinition: MockDefinition;
  isHoveringOverMenu: boolean;

  /**
   * Clones a scenario, and adds the -copy suffix to the name. If a scenario already exists with that suffix (and has the same name),
   * then a montonically increasing integer will be appended such that it does not conflict with any existing scenario names.
   */
  cloneScenario(scenario: Scenario) {
    this.logger.debug(scenario);
    this.logger.debug('scenario to clone emmited');
    this.shouldCloneToView.emit(scenario);
  }

  constructor(private store: DesignerStore, private logger: NGXLogger) {
    this.store.state$.subscribe(state => {
      this.mockDefinition = state.mockDefinition;
    });
  }

  ngOnInit() {}

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
  confirmDeleteDialog() {
    this.triggerOpen = true;
  }

  /**
   * This method delete the scenario in the store when the user clicks on the confirm box and does nothing if the user cancels
   * the scenario deletion
   * @param confirmed boolean is true when the user clicks on confirm scenario deletion
   */
  onDialogAction(confirmed: boolean, scenario: Scenario) {
    if (confirmed) {
      this.deleteScenario(scenario);
      this.logger.debug(
        `Scenario ${scenario.metadata.title} deleted successfully`
      );
    }

    this.triggerOpen = false;
    this.logger.debug(
      `Scenario ${scenario.metadata.title} deletion aborted`
    );
  }

  /**
   * This method updates the store with the current scenario filtered out
   */
  deleteScenario(scenario: Scenario) {
    this.store.deleteScenario(scenario.id);
  }

  /**
   * This method sets the body text with the deletion prompt
   */
  getBodyText(scenario: Scenario): string {
    return `Are you sure you want to delete '${scenario.metadata.title.bold()}' ?`;
  }
}
