import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';

@Component({
  selector: 'app-scenario-details',
  templateUrl: './scenario-details.component.html',
  styleUrls: ['./scenario-details.component.scss']
})
export class ScenarioDetailsComponent implements OnInit {
  @Input() scenario: Scenario;
  selected: boolean;

  constructor(private app: AppStore) {
    this.app.state$.subscribe(
      state =>
        (this.selected =
          !!this.scenario && this.scenario.id === state.selectedScenario.id)
    );
  }

  ngOnInit() {}

  onSelect() {
    this.app.selectedScenario = this.scenario;
  }
}
