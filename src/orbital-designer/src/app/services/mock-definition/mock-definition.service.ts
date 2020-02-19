import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Injectable } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, EMPTY } from 'rxjs';
import * as uuid from 'uuid';
import * as _ from 'lodash';
import { recordAdd } from 'src/app/models/record';
import { KeyValuePairRule } from 'src/app/models/mock-definition/scenario/key-value-pair-rule.model';
import { BodyRule } from 'src/app/models/mock-definition/scenario/body-rule.model';

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
              headers: s.response.headers
            },
            requestMatchRules: {
              headerRules:
                s.requestMatchRules.headerRules || ([] as KeyValuePairRule[]),
              queryRules:
                s.requestMatchRules.queryRules || ([] as KeyValuePairRule[]),
              bodyRules: s.requestMatchRules.bodyRules || ([] as BodyRule[]),
              urlRules:
                s.requestMatchRules.urlRules || ([] as KeyValuePairRule[])
            }
          }))
        };
        const titlemockdef = (content as MockDefinition).metadata.title;
        this.store.mockDefinitions = [content];
        recordAdd(this.store.state.mockDefinitions, titlemockdef, content);
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
              headers: s.response.headers
            },
            requestMatchRules: {
              headerRules: s.requestMatchRules.headerRules,
              queryRules: s.requestMatchRules.queryRules,
              bodyRules: s.requestMatchRules.bodyRules,
              urlRules: s.requestMatchRules.urlRules
            }
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
  public cloneScenario(
    mockId: string,
    scenario: Scenario
  ): Observable<boolean> {
    return new Observable(observer => {
      try {
        if (
          !scenario ||
          !scenario.id ||
          !scenario.metadata ||
          !scenario.metadata.title
        ) {
          this.logger.warn(
            'Scenario not cloned because it contains undefined attributes'
          );
          observer.next(false);
          return;
        }

        // copy scenario using deep copy
        const clonedScenario = _.cloneDeep(scenario);
        clonedScenario.id = uuid.v4();
        clonedScenario.metadata.title = clonedScenario.metadata.title + '-copy';
        const scenariomockdefinition = this.store.state.mockDefinitions[mockId];
        this.store.state.mockDefinition = scenariomockdefinition;
        const originalScenarioIndex = scenariomockdefinition.scenarios.indexOf(
          scenario
        );

        // ensure that there are no naming conflicts; if there are, repeat until a name is found
        if (
          !scenariomockdefinition.scenarios.find(
            x => x.metadata.title === clonedScenario.metadata.title
          )
        ) {
          let copyCounter = 2;
          while (
            scenariomockdefinition.scenarios.find(
              x =>
                x.metadata.title ===
                clonedScenario.metadata.title + ' ' + copyCounter
            )
          ) {
            copyCounter++;
          }

          clonedScenario.metadata.title =
            clonedScenario.metadata.title + ' ' + copyCounter;
        }
        scenariomockdefinition.scenarios.splice(
          originalScenarioIndex + 1,
          0,
          clonedScenario
        );
        this.store.updateScenarios([...scenariomockdefinition.scenarios]);
        this.logger.warn('Scenario successfully cloned: ', clonedScenario);
        observer.next(true);
      } catch (error) {
        observer.error(error);
      }
      observer.complete();
    });
  }
}
