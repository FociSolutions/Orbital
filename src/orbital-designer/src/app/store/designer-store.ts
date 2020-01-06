import { Endpoint } from '../models/endpoint.model';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { Store } from 'rxjs-observable-store';
import { Injectable } from '@angular/core';
import { OpenAPIV2 } from 'openapi-types';
import { VerbType } from '../models/verb.type';
import { Metadata } from '../models/mock-definition/metadata.model';
import { NGXLogger } from 'ngx-logger';
import Json from '../models/json';
import { cloneDeep } from 'lodash';

export interface State {
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;
  mockDefinition: MockDefinition;
  mockDefinitions: Map<string, MockDefinition>;
  endpoints: Endpoint[];
}

Injectable();
export class DesignerStore extends Store<State> {
  private static readonly mockDefinitionStoreKey = 'orbital_state_mockDefinition';
  private static readonly mockDefinitionsStoreKey = 'orbital_state_mockDefinitions';
  private static readonly endpointsStoreKey = 'orbital_state_enpoints';
  private static readonly selectedEndpointStoreKey = 'orbital_state_selectedEndpoint';
  private static readonly selectedScenarioStoreKey = 'orbital_state_selectedScenario';

  constructor(private logger: NGXLogger) {
    super({
      selectedEndpoint: JSON.parse(localStorage.getItem(DesignerStore.selectedEndpointStoreKey)),
      selectedScenario: JSON.parse(localStorage.getItem(DesignerStore.selectedScenarioStoreKey)),
      mockDefinition: MockDefinition.toMockDefinition(localStorage.getItem(DesignerStore.mockDefinitionStoreKey)),
      mockDefinitions: MockDefinition.toMockDefinintionMap(localStorage.getItem(DesignerStore.mockDefinitionsStoreKey))
      || new Map<string, MockDefinition>(),
      endpoints: JSON.parse(localStorage.getItem(DesignerStore.endpointsStoreKey)) || []
    });

    this.state$.subscribe(state => {
      const clonedDefinition = cloneDeep(state.mockDefinition);
      const clonedDefinitions = cloneDeep(state.mockDefinitions);
      localStorage.setItem(DesignerStore.mockDefinitionStoreKey, JSON.stringify(Json.mapToObject(clonedDefinition)));
      localStorage.setItem(DesignerStore.mockDefinitionsStoreKey, JSON.stringify(Json.mapToObject(clonedDefinitions)));
      localStorage.setItem(DesignerStore.endpointsStoreKey, JSON.stringify(state.endpoints));
      localStorage.setItem(DesignerStore.selectedEndpointStoreKey, JSON.stringify(state.selectedEndpoint));
      localStorage.setItem(DesignerStore.selectedScenarioStoreKey, JSON.stringify(state.selectedScenario));
    });
  }

  /**
   * This setter updates the mockDefinitions map with the mockDefinitions parameter
   * It creates a new Map for the store in order to trigger any render changes relying on this map.
   * Also updates the mockDefinition to the first mockDefinition in the list
   */
  set mockDefinitions(mockDefinitions: MockDefinition[]) {
    this.logger.debug('Setting mockDefinitions to ', mockDefinitions);
    this.setState({
      ...this.state,
      mockDefinitions: new Map<string, MockDefinition>(
        mockDefinitions.map(mockDefinition => [
          mockDefinition.metadata.title,
          mockDefinition
        ])
      )
    });
    this.mockDefinition = mockDefinitions[0];
  }

  /**
   * Deletes a mock definition by title
   */
   deleteMockDefinitionByTitle(mockTitle: string) {
    if (this.state.mockDefinitions.delete(mockTitle)) {
      this.logger.debug('Deleting mock ', mockTitle);
      this.setState({...this.state, mockDefinitions: this.state.mockDefinitions});

      if (!!this.state.mockDefinitions && this.state.mockDefinitions.size) {
        this.logger.debug('Mock store contains at least one mock; setting first mock to one in store ', this.state.mockDefinitions);
        this.mockDefinition = this.state.mockDefinitions.values().next().value;

        if (this.mockDefinition) {
          this.setEndpoints(this.mockDefinition.openApi);
          this.selectedEndpoint = null;
          this.selectedScenario = null;
        }
      }
    }
   }

  /**
   * Appends a mock definition to the store; if one with the same name already exists
   * it will be overwritten
   */
  public appendMockDefinition(mockDefinition: MockDefinition) {
    this.setState({...this.state, mockDefinitions: this.state.mockDefinitions.set(mockDefinition.metadata.title, mockDefinition)});
    this.logger.debug('New state after appending', this.state);
    this.mockDefinition = this.state.mockDefinitions.values().next().value;

    if (this.mockDefinition) {
      this.setEndpoints(this.mockDefinition.openApi);
      this.logger.debug('Setting endpoints', this.mockDefinition.openApi);
      this.selectedEndpoint = null;
      this.selectedScenario = null;
    }
  }

  /**
   * This setter updates the selected endpoint for the designer store
   */
  set selectedEndpoint(endpoint: Endpoint) {
    this.logger.debug('setting selectedEndpoint to ', endpoint);
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
    this.logger.debug('setting selectedScenario to ', scenario);
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
    this.logger.debug('Clearing current endpoints: ', clearStore);
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
    this.logger.debug('Endpoints from openApi document ', endpoints);
    this.setState({
      ...this.state,
      endpoints: clearStore
        ? [...endpoints]
        : [...this.state.endpoints, ...endpoints]
    });
  }

  /**
   * Setter method used to updated the MockDefinition in the designer store and the endpoints list
   * @param mockDefinition The MockDefinition used to update the store
   */
  set mockDefinition(mockDefinition: MockDefinition) {
    const mockDefinitionCopy = { ...mockDefinition };
    const mockDefinitions = this.state.mockDefinitions.set(
      mockDefinition.metadata.title,
      mockDefinitionCopy
    );
    this.logger.debug('Setting mockDefinition to ', mockDefinition);
    this.setState({
      ...this.state,
      mockDefinitions,
      mockDefinition: mockDefinitionCopy
    });
    this.setEndpoints(mockDefinition.openApi);
  }

  /**
   * This method updates Metadata for the MockDefinition in the designer store
   * @param m The metadata used to update the MockDefinition in the designer store
   *
   */
  updateMetadata(metadata: Metadata): void {
    this.logger.debug('Setting metadata to ', metadata);
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
   * Add the provided scenario to current mock definition;
   * If scenario already exist, update the existing scenario
   * @param scenario Scenario to add to current mock definition
   */
  addOrUpdateScenario(scenario: Scenario) {
    const currentMock = this.state.mockDefinition;
    if (currentMock) {
      let current = currentMock.scenarios.find(s => s.id === scenario.id);
      if (current) {
        this.logger.debug(
          'DesignerStore:AddOrUpdateScenario: Provided scenario already exist in the mock definition',
          current,
          scenario
        );
        current.metadata.title = scenario.metadata.title;
        current.metadata.description = scenario.metadata.description;

        current.requestMatchRules.bodyRules =
          scenario.requestMatchRules.bodyRules;
        current.requestMatchRules.headerRules =
          scenario.requestMatchRules.headerRules;
        current.requestMatchRules.queryRules =
          scenario.requestMatchRules.queryRules;

        current.response.body = scenario.response.body;
        current.response.headers = scenario.response.headers;
        current.response.status = scenario.response.status;
      } else {
        this.logger.debug(
          'DesignerStore:AddOrUpdateScenario: Unable to find provided scenario in the mock definition, Append it to the end of the list',
          scenario
        );
        current = scenario;
        currentMock.scenarios.push(current);
      }
      this.selectedScenario = current;
    }
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
    this.logger.debug('Setting host to ', host);
    this.logger.debug('Setting basePath to ', basePath);
    this.logger.debug('Setting openApi to ', openApi);
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
    this.logger.debug('Setting scenarios to ', scenarios);
    this.mockDefinition = {
      ...this.state.mockDefinition,
      scenarios: [...scenarios]
    };
  }

  deleteScenario(scenarioId: string) {
    this.mockDefinition = {
      ...this.state.mockDefinition,
      scenarios: this.state.mockDefinition.scenarios.filter(
        s => s.id !== scenarioId
      )
    };
  }
}
