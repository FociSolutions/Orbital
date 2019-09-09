import { Endpoint } from '../models/endpoint.model';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { Store } from 'rxjs-observable-store';
import { Injectable } from '@angular/core';
import { OpenAPIV2 } from 'openapi-types';
import { VerbType } from '../models/verb.type';
import { Metadata } from '../models/mock-definition/metadata.model';

export interface State {
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;
  mockDefinition: MockDefinition;
  endpoints: Endpoint[];
}

Injectable();
export class DesignerStore extends Store<State> {
  constructor() {
    super({
      selectedEndpoint: null,
      selectedScenario: null,
      mockDefinition: null,
      endpoints: []
    });
  }

  /**
   * This setter updates the selected endpoint for the designer store
   */
  set selectedEndpoint(endpoint: Endpoint) {
    this.setState({
      ...this.state,
      selectedEndpoint: {
        ...endpoint
      }
    });
  }

  /**
   * This setter updates the selected scenario for the designer store
   */
  set selectedScenario(scenario: Scenario) {
    this.setState({
      ...this.state,
      selectedScenario: {
        ...scenario
      }
    });
  }

  /**
   * setEndpoints reads the details of the endpoints specified in the Open Api document
   * and updates the state of the designer store.
   * @param doc The parsed Open Api document to extrapolate the endpoints from
   */
  setEndpoints(doc: OpenAPIV2.Document, clearStore = true): void {
    const pathStrings = Object.keys(doc.paths);
    let endpoints = [];
    for (const path of pathStrings) {
      const pathObject: OpenAPIV2.PathItemObject = doc.paths[path];
      const newEndpoints = Object.keys(VerbType)
        .map(verb => ({ verb: VerbType[verb], lowerVerb: verb.toLowerCase() }))
        .map(({ verb, lowerVerb }) =>
          !!pathObject[lowerVerb]
            ? { path, verb, spec: pathObject[lowerVerb] }
            : null
        )
        .filter(endpoint => !!endpoint);
      endpoints = [...endpoints, ...newEndpoints];
    }
    this.setState({
      ...this.state,
      endpoints: clearStore
        ? [...endpoints]
        : [...this.state.endpoints, ...endpoints]
    });
  }

  /**
   * Setter method used to updated the MockDefinition in the designer store
   * @param mockDefinition The MockDefinition used to update the store
   */
  set mockDefinition(mockDefinition: MockDefinition) {
    this.setState({
      ...this.state,
      mockDefinition: {
        ...mockDefinition
      }
    });
  }

  /**
   * This method updates Metadata for the MockDefinition in the designer store
   * @param m The metadata used to update the MockDefinition in the designer store
   *
   */
  updateMetadata(metadata: Metadata): void {
    this.setState({
      ...this.state,
      mockDefinition: {
        ...this.state.mockDefinition,
        metadata: {
          ...metadata
        }
      }
    });
  }

  /**
   * This method updates the host,basepath and openAPI spec of the MockDefinition in the designer store
   * @param host The string representing the host
   * @param basePath The string representing endpoint path
   * @param openApi The string representing openSpecAPI file contents
   */
  updateApiInformation(
    host: string,
    basePath: string,
    openApi: OpenAPIV2.Document
  ): void {
    this.setState({
      ...this.state,
      mockDefinition: {
        ...this.state.mockDefinition,
        host,
        basePath,
        openApi: { ...openApi }
      }
    });
  }

  /**
   * This method updates scenario array for the MockDefinition in the designer store
   * @param s The scenario array representing the MockDefinition scenarios
   */
  updateScenarios(scenarios: Scenario[]) {
    this.setState({
      ...this.state,
      mockDefinition: {
        ...this.state.mockDefinition,
        scenarios: [...scenarios]
      }
    });
  }
}
