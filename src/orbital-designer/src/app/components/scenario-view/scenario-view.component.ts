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
      this.scenarioList = [...state.mockDefinition.scenarios];
    });
  }

  scenarioToString(scenario: Scenario): string {
    return scenario.metadata.title;
  }

  setFilteredList(newScenarios: Scenario[]) {
    console.log(newScenarios);
    this.filteredList = newScenarios;
  }
  ngOnInit() {}
}
