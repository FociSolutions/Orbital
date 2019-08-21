import { Endpoint } from '../models/endpoint.model';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { Store } from 'rxjs-observable-store';
import { Injectable } from '@angular/core';

export interface State {
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;
  mockDefinition: MockDefinition;
  endpoints: Endpoint[];
}

Injectable({
  providedIn: 'root'
});
export default class DesignerStore extends Store<State> {
  constructor() {
    super({
      selectedEndpoint: null,
      selectedScenario: null,
      mockDefinition: null,
      endpoints: []
    });
  }

  set selectedEndpoint(endpoint: Endpoint) {
    this.setState({
      ...this.state,
      selectedEndpoint: endpoint
    });
  }

  set selectedScenario(scenario: Scenario) {
    this.setState({
      ...this.state,
      selectedScenario: scenario
    });
  }
}
