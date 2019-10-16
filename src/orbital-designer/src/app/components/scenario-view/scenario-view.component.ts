import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Endpoint } from 'src/app/models/endpoint.model';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Router } from '@angular/router';
import { NGXLogger, LoggerConfig } from 'ngx-logger';

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

  constructor(
    private store: DesignerStore,
    private router: Router,
    private logger: NGXLogger
  ) {
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
    return !!this.selectedEndpoint &&
      !!this.mockDefinition &&
      !!this.mockDefinition.openApi.paths[this.selectedEndpoint.path] &&
      !!this.selectedEndpoint.verb
      ? this.mockDefinition.openApi.paths[this.selectedEndpoint.path][
          this.selectedEndpoint.verb.toLowerCase()
        ].summary
      : 'No description';
  }
  addScenario() {
    this.router.navigateByUrl('scenario-editor');
  }
  /**
   * Goes back to the endpoint page
   */
  goToEndpoints() {
    this.router.navigateByUrl('endpoint-view');
  }
  /**
   * This function takes an scenario object and return its path as a string
   * @param scenario The scenario to be converted to string
   */
  scenarioToString(scenario: Scenario): string {
    if (!!scenario && !!scenario.metadata) {
      return scenario.metadata.title;
    }
  }
  /**
   * This function takes a list of scenarios and updates it to the new list of filtered scenarios
   * @param scenarios The list of scenarios
   */
  setFilteredList(newScenarios: Scenario[]) {
    if (!!newScenarios) {
      this.filteredList = newScenarios;
    } else {
      this.logger.debug('Scenario could not be set');
    }
  }
  /**
   * The function checks if there's matched scenario(s) found when searching.
   * Search is done by the search bar component.
   */
  showNotFound() {
    if (this.filteredList.length === 0 && this.endpointNoScenarios()) {
      return false;
    } else {
      return this.filteredList.length === 0;
    }
  }
  /**
   * Method that return a value if there are no scenarios found in the endpoint.
   */
  endpointNoScenarios() {
  if ( this.selectedEndpoint !== null) {
    return  this.mockDefinition.scenarios.filter(
      s =>
      s.path === this.selectedEndpoint.path &&
      s.verb === this.selectedEndpoint.verb
      ).length === 0;
    } else { return false; }
  }

  /**
   * Gets the verb for this endpoint to show in the chip
   */
  getEndpointVerb() {
    return !!this.selectedEndpoint ? this.selectedEndpoint.verb : null;
  }

  /**
   * Gets the color that the chip should be for the appropriate http verb of this endpoint.
   * Currently, this just returns one color but can be extended to return multiple colors.
   */
  getEndpointVerbChipColor() {
    switch (this.getEndpointVerb()) {
      case 'POST':
        return 'primary';
      case 'GET':
        return 'primary';
      case 'DELETE':
        return 'primary';
      case 'PUT':
        return 'primary';
    }
  }

  ngOnInit() {}
}
