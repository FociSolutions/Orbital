import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Scenario } from '../../../models/mock-definition/scenario/scenario.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-scenario-list',
  templateUrl: './scenario-list.component.html',
  styleUrls: ['./scenario-list.component.scss']
})
export class ScenarioListComponent implements OnInit {
  @Input() scenarios: Scenario[] = [];
  @Output() shouldCloneToView = new EventEmitter<Scenario>();

  constructor(private logger: NGXLogger) {}

  ngOnInit() {
  }

  /**
   * Clones a scenario, and adds the -copy suffix to the name. If a scenario already exists with that suffix (and has the same name),
   * then a montonically increasing integer will be appended such that it does not conflict with any existing scenario names.
   */
  cloneScenario(scenario: Scenario) {
    this.logger.debug(scenario);
    this.logger.debug('scenario to clone emmited');
    this.shouldCloneToView.emit(scenario);
  }
}
