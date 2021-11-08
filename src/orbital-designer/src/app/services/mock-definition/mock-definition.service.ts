import { Scenario, ScenarioParams } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Injectable } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable } from 'rxjs';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';
import { VerbType } from 'src/app/models/verb.type';
import { OpenAPIV2 } from 'openapi-types';
import { Policy } from 'src/app/models/mock-definition/scenario/policy.model';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';

@Injectable({
  providedIn: 'root'
})
export class MockDefinitionService {
  constructor(private store: DesignerStore, private logger: NGXLogger) {}

  /**
   * Parse provided string to mock definition, save it in the store and make it the current mockdefinition in the store.
   * @param mockDefinition String representation of mock definition
   */
  public AddMockDefinitionToStore(mockDefinition: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        let content = JSON.parse(mockDefinition);
        content = {
          ...content,
          scenarios: content.scenarios.map(s => ({
            ...s,
            response: {
              ...s.response,
              headers: s.response.headers,
              type: s.response.type || ResponseType.CUSTOM
            },
            requestMatchRules: {
              headerRules: s.requestMatchRules.headerRules || ([] as KeyValuePairRule[]),
              queryRules: s.requestMatchRules.queryRules || ([] as KeyValuePairRule[]),
              bodyRules: s.requestMatchRules.bodyRules || ([] as BodyRule[]),
              urlRules: s.requestMatchRules.urlRules || ([] as KeyValuePairRule[])
            },
            policies: s.policies || ([] as Policy[]),
            defaultScenario: s.defaultScenario || false
          }))
        };
        this.store.appendMockDefinition(content);
        this.store.mockDefinition = content;
        this.store.state.mockDefinition = content as MockDefinition;
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
  public validateMockDefinition(mockDefinition: string): Observable<boolean> {
    return new Observable(observer => {
      try {
        let content = JSON.parse(mockDefinition);
        content = {
          ...content,
          scenarios: content.scenarios.map(s => ({
            ...s,
            response: {
              ...s.response,
              headers: s.response.headers,
              type: s.response.type || ResponseType.CUSTOM
            },
            requestMatchRules: {
              headerRules: s.requestMatchRules.headerRules,
              queryRules: s.requestMatchRules.queryRules,
              bodyRules: s.requestMatchRules.bodyRules,
              urlRules: s.requestMatchRules.urlRules
            },
            policies: {
              ...s.policies
            },
            defaultScenario: s.defaultScenario
          }))
        };
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
  public cloneScenario(mockId: string, scenario: Scenario): Observable<boolean> {
    return new Observable(observer => {
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
        clonedScenario.metadata.title = clonedScenario.metadata.title + '-copy';
        const scenariomockdefinition = this.store.state.mockDefinitions[mockId];
        this.store.state.mockDefinition = scenariomockdefinition;
        const originalScenarioIndex = scenariomockdefinition.scenarios.indexOf(scenario);

        // ensure that there are no naming conflicts; if there are, repeat until a name is found
        if (scenariomockdefinition.scenarios.find(x => x.metadata.title === clonedScenario.metadata.title)) {
          let copyCounter = 2;
          while (
            scenariomockdefinition.scenarios.find(
              x => x.metadata.title === clonedScenario.metadata.title + ' ' + copyCounter
            )
          ) {
            copyCounter++;
          }

          clonedScenario.metadata.title = clonedScenario.metadata.title + ' ' + copyCounter;
        }
        scenariomockdefinition.scenarios.splice(originalScenarioIndex + 1, 0, clonedScenario);
        this.store.updateScenarios([...scenariomockdefinition.scenarios]);
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
  public getDefaultScenarios(endpoints: OpenAPIV2.PathsObject, validation: boolean = false): Scenario[] {
    const defaultScenariosPerEndpoint = [];
    const keyArrayofEndpoints = Object.keys(endpoints);

    keyArrayofEndpoints.forEach(pathName => {
      const endpoint = endpoints[pathName];
      const types = this.getEndpointVerbTypes(endpoint);

      types.forEach(type => {
        const newScenarioGet = this.generateNewScenario(this.defaultScenarioParams(pathName, type), true);
        defaultScenariosPerEndpoint.push(newScenarioGet);
        if (validation) {
          const tokenScenarioGet = this.generateNewScenario(this.defaultScenarioParams(pathName, type, 401, "Invalid-Token Scenario"));
          defaultScenariosPerEndpoint.push(tokenScenarioGet);
        }
      })
    });
    return defaultScenariosPerEndpoint;
  }

  public getDefaultValidationScenarios(scenarios: Scenario[]): Scenario[] {
    let scenarioList: Scenario[] = []
    let scenarioDict = this.mapUnauthorizedScenarios(scenarios);

    for (let endpoint in scenarioDict) {
      for (let verb in scenarioDict[endpoint]) {
        if (scenarioDict[endpoint][verb] == false) {
          const verbInt = parseInt(verb);
          scenarioList.push(this.generateNewScenario(this.defaultScenarioParams(endpoint, verbInt, 401, "Invalid-Token Scenario")));
        }
      }
    }
    return scenarioList;
  }

  private mapUnauthorizedScenarios(scenarios: Scenario[]): object {
    let scenarioDict = {};
    for (let scenario of scenarios) {
      let isUnauthorized: boolean = scenario.response.status == 401;

      if (scenarioDict[scenario.path]) {
        isUnauthorized = scenarioDict[scenario.path][scenario.verb] ? true : isUnauthorized;
      }
      else {
        scenarioDict[scenario.path] = {};
      }
      scenarioDict[scenario.path][scenario.verb] = isUnauthorized;
    }
    console.log(scenarioDict);
    return scenarioDict
  }

  public defaultScenarioParams(path: string, type: VerbType, status: number = 200, title: string = "Default OK Scenario"): ScenarioParams {
    return {
      title: title,
      description: '',
      path,
      status,
      verb: type,
    } as ScenarioParams;
  }

  private getEndpointVerbTypes(endpoint: any): VerbType[] {
    let verbs: VerbType[] = []
    const verbKeys = Object.keys(endpoint);
    verbKeys.forEach(key => {
      const type = VerbType[key.toUpperCase()];
      verbs.push(type);
    });
    return verbs;
  }

  /**
   * Generates a new Scenario based on the path and verb.
   *
   */
  public generateNewScenario(scenario: ScenarioParams, defaultScenario: boolean = false): Scenario {
    return {
      id: uuid.v4(),
      metadata: {
        title: scenario.title,
        description: scenario.description
      },
      verb: scenario.verb,
      path: scenario.path,
      response: {
        headers: {},
        body: '{}',
        status: scenario.status,
        type: ResponseType.CUSTOM
      },
      requestMatchRules: {
        headerRules: [],
        queryRules: [],
        bodyRules: [],
        urlRules: []
      },
      policies: [],
      defaultScenario,
      validationType: 0
    } as Scenario;
  }
}
