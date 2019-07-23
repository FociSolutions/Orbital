import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import {
  Scenario,
  newScenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';

import { ToastrService } from 'ngx-toastr';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';

@Component({
  selector: 'app-scenario-overview',
  templateUrl: './scenario-overview.component.html',
  styleUrls: ['./scenario-overview.component.scss']
})
export class ScenarioOverviewComponent implements OnInit {
  @Input() scenarios: Scenario[];

  constructor(
    private app: AppStore,
    private mockDefinitionStore: MockDefinitionStore,
    private toastr: ToastrService
  ) {}

  onAdd() {
    this.app.selectedScenario = newScenario(
      this.app.state.selectedEndpoint.verb,
      this.app.state.selectedEndpoint.path
    );
    this.mockDefinitionStore.updateScenarios([
      ...this.mockDefinitionStore.state.scenarios,
      this.app.state.selectedScenario
    ]);
    this.toastr.success('New Scenario Added!', '', {
      timeOut: 2000
    });
    this.app.showEditor = true;
  }

  ngOnInit() {}
}
