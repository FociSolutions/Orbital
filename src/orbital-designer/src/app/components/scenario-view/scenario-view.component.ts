import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Endpoint } from 'src/app/models/endpoint.model';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit {
  selectedEndpoint: Endpoint;
  mockDefinition: MockDefinition;
  scenarioList: Scenario[] = [];
  filteredList: Scenario[] = [];

  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.selectedEndpoint = state.selectedEndpoint;
      this.mockDefinition = state.mockDefinition;
      if (!!state.mockDefinition && !!state.mockDefinition.scenarios) {
        this.scenarioList = [...state.mockDefinition.scenarios];
      }
    });
  }

   /**
    * Gets the description for the scenario in the OpenAPI spec; returns no description
    * if there is no description.
    */
  getScenarioDescription() {
    return !!this.selectedEndpoint && !!this.mockDefinition &&
    !!this.mockDefinition.openApi.paths[this.selectedEndpoint.path] && !!this.selectedEndpoint.verb
      ? this.mockDefinition.openApi.paths[this.selectedEndpoint.path][
          this.selectedEndpoint.verb.toLowerCase()
        ].summary
      : 'No description';
  }

  scenarioToString(scenario: Scenario): string {
    if (!!scenario && !!scenario.metadata) {
      return scenario.metadata.title;
    }
  }

  setFilteredList(newScenarios: Scenario[]) {
    console.log(newScenarios);
    if (!!newScenarios) {
      this.filteredList = newScenarios;
    }
  }
  ngOnInit() {}
}
