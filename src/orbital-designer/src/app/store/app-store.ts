import { Store } from 'rxjs-observable-store';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { Endpoint } from '../models/endpoint.model';
import { Injectable } from '@angular/core';

export interface AppState {
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;
  showEditor: boolean;
}

Injectable();
export class AppStore extends Store<AppState> {
  constructor() {
    super({
      selectedEndpoint: null,
      selectedScenario: null,
      showEditor: false
    });
  }

  set selectedEndpoint(endpoint: Endpoint) {
    this.setState({
      ...this.state,
      selectedEndpoint: { ...endpoint }
    });
  }

  set selectedScenario(scenario: Scenario) {
    this.setState({
      ...this.state,
      selectedScenario: { ...scenario }
    });
  }

  set showEditor(showEditor: boolean) {
    this.setState({
      ...this.state,
      showEditor
    });
  }
}
