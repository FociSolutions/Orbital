import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import * as HttpStatus from 'http-status-codes';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import * as _ from 'lodash';

@Component({
  selector: 'app-scenario-list-item',
  templateUrl: './scenario-list-item.component.html',
  styleUrls: ['./scenario-list-item.component.scss']
})
export class ScenarioListItemComponent implements OnInit {
  @Input() scenario: Scenario;
  triggerOpen: boolean;
  mockDefinition: MockDefinition;
  isHoveringOverMenu: boolean;
  @Output() shouldClone = new EventEmitter<Scenario>();

  constructor(private store: DesignerStore, private logger: NGXLogger) {
    this.store.state$.subscribe(state => {
      this.mockDefinition = state.mockDefinition;
    });

    if (!!this.scenario) {
      this.store.selectedScenario = this.scenario;
    }
  }

  ngOnInit() {}

  /**
   * Gets the scenario response's status string
   */
  getScenarioResponseStatusString() {
    try {
      return HttpStatus.getStatusText(this.scenario.response.status);
    } catch (Error) {
      this.logger.warn(
        `Returning unknown for scenario status as the status is invalid:
          ${this.scenario.response.status}`
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
   * Clones a scenario, and adds the -copy suffix to the name. If a scenario already exists with that suffix (and has the same name),
   * then a montonically increasing integer will be appended such that it does not conflict with any existing scenario names.
   */
  cloneScenario() {
    this.shouldClone.emit(this.scenario);
  }

  /**
   * This method delete the scenario in the store when the user clicks on the confirm box and does nothing if the user cancels
   * the scenario deletion
   * @param confirmed boolean is true when the user clicks on confirm scenario deletion
   */
  onDialogAction(confirmed: boolean) {
    if (confirmed) {
      this.deleteScenario();
      this.logger.debug(
        `Scenario ${this.scenario.metadata.title} deleted successfully`
      );
    }

    this.triggerOpen = false;
    this.logger.debug(
      `Scenario ${this.scenario.metadata.title} deletion aborted`
    );
  }

  /**
   * This method updates the store with the current scenario filtered out
   */
  deleteScenario() {
    this.store.deleteScenario(this.scenario.id);
  }

  /**
   * This method sets the body text with the deletion prompt
   */
  get bodyText(): string {
    return `Are you sure you want to delete '${this.scenario.metadata.title.bold()}' ?`;
  }
}
