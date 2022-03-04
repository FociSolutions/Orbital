import { Scenario, ScenarioParams } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Injectable } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { VerbType } from 'src/app/models/verb-type';
import { OpenAPIV2 } from 'openapi-types';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response-type';
import { defaultTokenRule } from 'src/app/models/mock-definition/scenario/token-rule.model';
import * as HttpStatus from 'http-status-codes';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Injectable({
  providedIn: 'root',
})
export class MockDefinitionService {
  constructor(private store: DesignerStore, private logger: NGXLogger) {}

  /**
   * Parse provided string to mock definition, save it in the store and make it the current mockdefinition in the store.
   * @param mockDefinition String representation of mock definition
   */
  AddMockDefinitionToStore(mockDefinition: string): Observable<boolean> {
    return new Observable((observer) => {
      try {
        let content: MockDefinition = JSON.parse(mockDefinition);
        content = {
          ...content,
          scenarios: content.scenarios.map(
            (s: Scenario): Scenario => ({
              ...s,
              response: {
                ...s.response,
                headers: s.response.headers,
                type: s.response.type ?? ResponseType.CUSTOM,
              },
              requestMatchRules: {
                headerRules: s.requestMatchRules?.headerRules ?? [],
                queryRules: s.requestMatchRules?.queryRules ?? [],
                bodyRules: s.requestMatchRules?.bodyRules ?? [],
                urlRules: s.requestMatchRules?.urlRules ?? [],
              },
              policies: s.policies ?? [],
              tokenRule: {
                ...s.tokenRule,
                rules: s.tokenRule?.rules ?? [],
              },
              defaultScenario: s.defaultScenario ?? false,
            })
          ),
        };
        this.store.appendMockDefinition(content);
        this.store.mockDefinition = content;
        this.store.state.mockDefinition = content;
        observer.next(true);
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  /**
   * Validates if a string is a valid mockdefinition.
   * @param mockDefinition String representation of mock definition
   */
  validateMockDefinition(mockDefinition: string): Observable<boolean> {
    return new Observable((observer) => {
      try {
        JSON.parse(mockDefinition);
        observer.next(true);
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  /*
   * Clones the provided scenario and updates the mock definition in the store with the new copy scenario
   * @param mockId  string representation of mock definition's id
   * @param scenario Object representation of the scenario to be cloned
   */
  cloneScenario(mockId: string, scenario?: Scenario | null): Observable<boolean> {
    return new Observable((observer) => {
      try {
        if (!scenario || !scenario.id || !scenario.metadata || !scenario.metadata.title) {
          this.logger.warn('Scenario not cloned because it contains undefined attributes');
          observer.next(false);
          return;
        }

        // copy scenario using deep copy
        const clonedScenario = _.cloneDeep(scenario);
        clonedScenario.defaultScenario = false;
        clonedScenario.id = uuid.v4();
        clonedScenario.metadata.title = `${clonedScenario.metadata.title}-copy`;
        const scenarioMockDefinition = this.store.state.mockDefinitions[mockId];
        this.store.state.mockDefinition = scenarioMockDefinition;
        const originalScenarioIndex = scenarioMockDefinition.scenarios.indexOf(scenario);

        // ensure that there are no naming conflicts; if there are, repeat until a name is found
        if (scenarioMockDefinition.scenarios.find((x) => x.metadata.title === clonedScenario.metadata.title)) {
          let copyCounter = 2;
          while (
            scenarioMockDefinition.scenarios.find(
              (x) => x.metadata.title === `${clonedScenario.metadata.title} ${copyCounter}`
            )
          ) {
            copyCounter++;
          }

          clonedScenario.metadata.title = `${clonedScenario.metadata.title} ${copyCounter}`;
        }
        scenarioMockDefinition.scenarios.splice(originalScenarioIndex + 1, 0, clonedScenario);
        this.store.updateScenarios([...scenarioMockDefinition.scenarios]);
        this.logger.warn('Scenario successfully cloned: ', clonedScenario);
        observer.next(true);
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }

  /**
   * Generate default Scenarios based on the endpoints provided.
   *
   * @param endpoints list of endpoints from the imported openapi document
   */
  getDefaultScenarios(endpoints: OpenAPIV2.PathsObject, validation = false): Scenario[] {
    const defaultScenariosPerEndpoint: Scenario[] = [];
    const keyArrayOfEndpoints = Object.keys(endpoints);

    keyArrayOfEndpoints.forEach((pathName) => {
      const endpoint = endpoints[pathName];
      const types = this.getEndpointVerbTypes(endpoint);

      types.forEach((type) => {
        const newScenarioGet = this.generateNewScenario(this.defaultScenarioParams(pathName, type), true);
        defaultScenariosPerEndpoint.push(newScenarioGet);
        if (validation) {
          const tokenScenarioGet = this.generateNewScenario(
            this.defaultScenarioParams(pathName, type, HttpStatus.StatusCodes.UNAUTHORIZED, 'Invalid-Token Scenario')
          );
          defaultScenariosPerEndpoint.push(tokenScenarioGet);
        }
      });
    });
    return defaultScenariosPerEndpoint;
  }

  getDefaultValidationScenarios(scenarios: Scenario[]): Scenario[] {
    const scenarioList: Scenario[] = [];
    const scenarioDict = this.mapUnauthorizedScenarios(scenarios);

    for (const endpoint in scenarioDict) {
      for (const verb in scenarioDict[endpoint]) {
        if (scenarioDict[endpoint][verb] === false) {
          const verbInt = parseInt(verb);
          scenarioList.push(
            this.generateNewScenario(
              this.defaultScenarioParams(
                endpoint,
                verbInt,
                HttpStatus.StatusCodes.UNAUTHORIZED,
                'Invalid-Token Scenario'
              )
            )
          );
        }
      }
    }
    return scenarioList;
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private mapUnauthorizedScenarios(scenarios: Scenario[]): Record<string, any> {
    const scenarioDict = {};
    for (const scenario of scenarios) {
      let isUnauthorized: boolean = scenario.response.status === HttpStatus.StatusCodes.UNAUTHORIZED;

      if (scenarioDict[scenario.path]) {
        isUnauthorized = scenarioDict[scenario.path][scenario.verb] ? true : isUnauthorized;
      } else {
        scenarioDict[scenario.path] = {};
      }
      scenarioDict[scenario.path][scenario.verb] = isUnauthorized;
    }
    return scenarioDict;
  }

  defaultScenarioParams(
    path: string,
    verb: VerbType,
    status: HttpStatus.StatusCodes = HttpStatus.StatusCodes.OK,
    title: string = 'Default OK Scenario'
  ): ScenarioParams {
    return {
      title,
      description: '',
      path,
      status,
      verb,
    };
  }

  private getEndpointVerbTypes(endpoint: OpenAPIV2.PathItemObject): VerbType[] {
    const verbs: VerbType[] = [];
    const verbKeys = Object.keys(endpoint);
    verbKeys.forEach((key) => {
      const type = VerbType[key.toUpperCase()];
      verbs.push(type);
    });
    return verbs;
  }

  /**
   * Generates a new Scenario based on the path and verb.
   *
   */
  generateNewScenario(scenario: ScenarioParams, defaultScenario = false): Scenario {
    return {
      id: uuid.v4(),
      metadata: {
        title: scenario.title,
        description: scenario.description,
      },
      verb: scenario.verb,
      path: scenario.path,
      response: {
        headers: {},
        body: '{}',
        status: scenario.status,
        type: ResponseType.CUSTOM,
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [],
        urlRules: [],
      },
      policies: [],
      defaultScenario,
      tokenRule: defaultTokenRule,
    };
  }
}
