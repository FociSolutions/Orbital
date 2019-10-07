import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import * as HttpStatus from 'http-status-codes';

@Component({
  selector: 'app-scenario-list-item',
  templateUrl: './scenario-list-item.component.html',
  styleUrls: ['./scenario-list-item.component.scss']
})
export class ScenarioListItemComponent implements OnInit {
  @Input() scenario: Scenario;
  triggerOpen: boolean;

  constructor(private logger: NGXLogger) {}

  ngOnInit() {}

  /**
   * Gets the scenario response's status string
   */
  getScenarioResponseStatusString() {
    return HttpStatus.getStatusText(this.scenario.response.status);
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
  onDialogAction(confirmed: boolean) {
    if (confirmed) {
      this.scenario = null;
    }

    this.triggerOpen = false;
  }

  /**
   * This method sets the body text with the deletion prompt
   */
  get bodyText(): string {
    return `Are you sure you want to delete '${this.scenario.metadata.title}'`;
  }
}
