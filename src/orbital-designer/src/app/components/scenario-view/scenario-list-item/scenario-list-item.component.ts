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

  confirmDeleteDialog() {
    this.triggerOpen = true;
  }

  onDialogAction(confirmed: boolean) {
    if (confirmed) {
      //delete code
    }

    this.triggerOpen = false;
  }

  get bodyText(): string {
    return `Are you sure you want to delete ${this.scenario.id}`;
  }
}
