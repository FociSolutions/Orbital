import { Endpoint } from '../models/endpoint.model';
import { Scenario } from '../models/mock-definition/scenario/scenario.model';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { Store } from 'rxjs-observable-store';
import { Injectable } from '@angular/core';
import { OpenAPIV2 } from 'openapi-types';
import { VerbType } from '../models/verb-type';
import { Metadata } from '../models/mock-definition/metadata.model';
import { NGXLogger } from 'ngx-logger';
import { cloneDeep } from 'lodash';

function isNotNull<T>(arg: T): arg is Exclude<T, null> {
  return arg !== null;
}

export interface State {
  selectedEndpoint: Endpoint | null;
  selectedScenario: Scenario | null;
  mockDefinition: MockDefinition;
  mockDefinitions: Record<string, MockDefinition>;
  endpoints: Endpoint[];
}

Injectable();
@Injectable()
export class DesignerStore extends Store<State> {
  private static readonly mockDefinitionStoreKey = 'orbital_state_mockDefinition';
  private static readonly mockDefinitionsStoreKey = 'orbital_state_mockDefinitions';
  private static readonly endpointsStoreKey = 'orbital_state_endpoints';
  private static readonly selectedEndpointStoreKey = 'orbital_state_selectedEndpoint';
  private static readonly selectedScenarioStoreKey = 'orbital_state_selectedScenario';

  constructor(private logger: NGXLogger) {
    super({
      selectedEndpoint: JSON.parse(localStorage.getItem(DesignerStore.selectedEndpointStoreKey) ?? ''),
      selectedScenario: JSON.parse(localStorage.getItem(DesignerStore.selectedScenarioStoreKey) ?? ''),
      mockDefinition: JSON.parse(localStorage.getItem(DesignerStore.mockDefinitionStoreKey) ?? ''),
      mockDefinitions: JSON.parse(localStorage.getItem(DesignerStore.mockDefinitionsStoreKey) ?? '') || {},
      endpoints: JSON.parse(localStorage.getItem(DesignerStore.endpointsStoreKey) ?? '') || [],
    });

    this.state$.subscribe((state) => {
      const clonedDefinition = cloneDeep(state.mockDefinition);
      const clonedDefinitions = cloneDeep(state.mockDefinitions);
      localStorage.setItem(DesignerStore.mockDefinitionStoreKey, JSON.stringify(clonedDefinition));
      localStorage.setItem(DesignerStore.mockDefinitionsStoreKey, JSON.stringify(clonedDefinitions));
      localStorage.setItem(DesignerStore.endpointsStoreKey, JSON.stringify(state.endpoints));
      localStorage.setItem(DesignerStore.selectedEndpointStoreKey, JSON.stringify(state.selectedEndpoint));
      localStorage.setItem(DesignerStore.selectedScenarioStoreKey, JSON.stringify(state.selectedScenario));
    });
  }

  /**
   * This setter updates the Mockdefinitions map with the Mockdefinitions parameter
   * It creates a new Map for the store in order to trigger any render changes relying on this map.
   * Also updates the mockDefinition to the first mockDefinition in the list
   */
  set mockDefinitions(mockDefinitions: MockDefinition[]) {
    this.logger.debug('Setting mockDefinitions to ', mockDefinitions);
    this.setState({
      ...this.state,
      mockDefinitions: mockDefinitions.reduce<Record<string, MockDefinition>>((dictionary, mockDef) => {
        dictionary[mockDef.metadata.title] = mockDef;
        return dictionary;
      }, {}),
    });
    this.mockDefinition = mockDefinitions[0];
  }

  /**
   * Deletes a mock definition by title
   */
  deleteMockDefinitionByTitle(mockTitle: string) {
    if (this.state.mockDefinitions[mockTitle]) {
      this.logger.debug('Deleting mock ', mockTitle);
      const { [mockTitle]: _, ...mockDefinitions } = this.state.mockDefinitions;
      this.state.mockDefinitions = mockDefinitions;
      this.setState({ ...this.state });

      const mockDefNames = Object.keys(this.state.mockDefinitions ?? {});
      if (mockTitle === this.mockDefinition?.metadata?.title && mockDefNames.length) {
        this.logger.debug(
          'Mock store contains at least one mock; setting first mock to one in store ',
          this.state.mockDefinitions
        );
        this.mockDefinition = this.state.mockDefinitions[mockDefNames[0]];
        this.selectedEndpoint = null;
        this.selectedScenario = null;
      }
    }
  }

  /**
   * Updates a mock definition by title
   */
  private updateMockDefinitionsState(mockDefinition: MockDefinition) {
    this.logger.debug('Updating mock ', mockDefinition.metadata.title);
    this.state.mockDefinitions[mockDefinition.metadata.title] = mockDefinition;
    this.setState({ ...this.state });
  }

  /**
   * Appends a mock definition to the store; if one with the same name already exists
   * it will be overwritten
   */
  appendMockDefinition(mockDefinition: MockDefinition) {
    this.logger.debug('Appending mock definition', mockDefinition);
    this.updateMockDefinitionsState(mockDefinition);

    this.logger.debug('New state after appending', this.state);
    this.mockDefinition = Object.values(this.state.mockDefinitions)?.[0] ?? null;

    if (this.state.mockDefinition) {
      this.selectedEndpoint = null;
      this.selectedScenario = null;
    }
  }

  /**
   * This setter updates the selected endpoint for the designer store
   */
  set selectedEndpoint(endpoint: Endpoint | null) {
    this.logger.debug('setting selectedEndpoint to ', endpoint);
    this.setState({
      ...this.state,
      selectedEndpoint: endpoint ? { ...endpoint } : null,
    });
  }

  /**
   * This setter updates the selected scenario for the designer store
   */
  set selectedScenario(scenario: Scenario | null) {
    this.logger.debug('setting selectedScenario to ', scenario);
    this.setState({
      ...this.state,
      selectedScenario: scenario ? { ...scenario } : null,
    });
  }

  /**
   * setEndpoints reads the details of the endpoints specified in the Open Api document
   * and updates the state of the designer store.
   * @param doc The parsed Open Api document to extrapolate the endpoints from
   * @param clearStore Whether to clear the store before clearing the endpoints
   */
  setEndpoints(doc: OpenAPIV2.Document, clearStore = true): void {
    this.logger.debug('Clearing current endpoints: ', clearStore);
    const pathStrings = Object.keys(doc.paths);
    let endpoints: Endpoint[] = [];
    for (const path of pathStrings) {
      const pathObject: OpenAPIV2.PathItemObject = doc.paths[path];
      const newEndpoints: Endpoint[] = Object.keys(VerbType)
        .map((verb) => ({ verb: VerbType[verb], lowerVerb: verb.toLowerCase() }))
        .map(({ verb, lowerVerb }) => (pathObject[lowerVerb] ? { path, verb, spec: pathObject[lowerVerb] } : null))
        .filter(isNotNull);
      endpoints = [...endpoints, ...newEndpoints];
    }
    this.logger.debug('Endpoints from openApi document ', endpoints);
    this.setState({
      ...this.state,
      endpoints: clearStore ? [...endpoints] : [...this.state.endpoints, ...endpoints],
    });
  }

  /**
   * Setter method used to updated the MockDefinition in the designer store and the endpoints list
   * @param mockDefinition The MockDefinition used to update the store
   */
  set mockDefinition(mockDefinition: MockDefinition) {
    const mockDefinitionCopy = { ...mockDefinition };
    this.state.mockDefinitions[mockDefinition.metadata.title] = mockDefinitionCopy;
    this.logger.debug('Setting mockDefinition to ', mockDefinition);
    this.setState({ ...this.state, mockDefinition: mockDefinitionCopy });
    this.setEndpoints(mockDefinition.openApi);
  }

  /**
   * This method updates Metadata for the MockDefinition in the designer store
   *
   * @param metadata The metadata to update
   */
  updateMetadata(metadata: Metadata): void {
    this.logger.debug('Setting metadata to ', metadata);
    this.setState({
      ...this.state,
      mockDefinition: {
        ...this.state.mockDefinition,
        metadata: {
          ...metadata,
        },
      },
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
      let current = currentMock.scenarios.find((s) => s.id === scenario.id);
      if (current) {
        this.logger.debug(
          'DesignerStore:AddOrUpdateScenario: Provided scenario already exist in the mock definition',
          current,
          scenario
        );
        current.metadata.title = scenario.metadata.title;
        current.metadata.description = scenario.metadata.description;

        current.requestMatchRules.bodyRules = scenario.requestMatchRules.bodyRules;
        current.requestMatchRules.headerRules = scenario.requestMatchRules.headerRules;
        current.requestMatchRules.queryRules = scenario.requestMatchRules.queryRules;
        current.requestMatchRules.urlRules = scenario.requestMatchRules.urlRules;
        current.defaultScenario = scenario.defaultScenario;

        current.policies = scenario.policies;

        current.response.body = scenario.response.body;
        current.response.headers = scenario.response.headers;
        current.response.status = scenario.response.status;
        current.response.type = scenario.response.type;

        current.tokenRule = scenario.tokenRule;
      } else {
        this.logger.debug(
          'DesignerStore:AddOrUpdateScenario: Unable to find provided scenario in the mock definition, Append it to the end of the list',
          scenario
        );
        current = scenario;
        currentMock.scenarios.push(current);
      }
      this.updateMockDefinitionsState(currentMock);
    }
  }

  /**
   * This method updates the host,basePath and openAPI spec of the MockDefinition in the designer store
   * @param host The string representing the host
   * @param basePath The string representing endpoint path
   * @param openApi The string representing openSpecAPI file contents
   */
  updateApiInformation(host: string, basePath: string, openApi: OpenAPIV2.Document): void {
    this.logger.debug('Setting host to ', host);
    this.logger.debug('Setting basePath to ', basePath);
    this.logger.debug('Setting openApi to ', openApi);
    this.setState({
      ...this.state,
      mockDefinition: {
        ...this.state.mockDefinition,
        host,
        basePath,
        openApi: { ...openApi },
      },
    });
  }

  /**
   * This method updates scenario array for the MockDefinition in the designer store
   * @param scenarios The list of scenarios to update
   */
  updateScenarios(scenarios: Scenario[]) {
    this.logger.debug('Setting scenarios to ', scenarios);
    this.mockDefinition = {
      ...this.state.mockDefinition,
      scenarios: [...scenarios],
    };
  }

  deleteScenario(scenarioId: string) {
    this.mockDefinition = {
      ...this.state.mockDefinition,
      scenarios: this.state.mockDefinition.scenarios.filter((s) => s.id !== scenarioId),
    };
  }
}
