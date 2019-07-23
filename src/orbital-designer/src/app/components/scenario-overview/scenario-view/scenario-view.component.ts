import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  Scenario,
  newScenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit {
  @Input() scenarios: Scenario[];

  constructor(private app: AppStore) {}

  onAdd() {
    this.app.selectedScenario = newScenario(
      this.app.state.selectedEndpoint.verb,
      this.app.state.selectedEndpoint.path
    );
    this.app.showEditor = true;
  }

  ngOnInit() {}
}
