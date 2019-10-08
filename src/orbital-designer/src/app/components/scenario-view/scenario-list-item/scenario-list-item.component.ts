import { Component, OnInit, Input } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import * as HttpStatus from 'http-status-codes';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-scenario-list-item',
  templateUrl: './scenario-list-item.component.html',
  styleUrls: ['./scenario-list-item.component.scss']
})
export class ScenarioListItemComponent implements OnInit {
  @Input() scenario: Scenario;

  constructor(private logger: NGXLogger, private store: DesignerStore) {
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
      this.logger.warn('Returning unknown for scenario status as the status is invalid: ' + this.scenario.response.status);
      return 'Unknown';
    }
  }
}
