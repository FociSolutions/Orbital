import { Metadata } from './metadata.model';
import { Scenario } from './scenario/scenario.model';
import * as yaml from 'js-yaml';
import { OpenAPIV2 } from 'openapi-types';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import Json from '../json';

/**
 * Model representation of mock definition
 */
export class MockDefinition {
  metadata: Metadata;
  host?: string;
  basePath?: string;
  scenarios: Scenario[] = [];
  openApi: OpenAPIV2.Document;

  /**
   * Parse provided string to mock definition
   * @param mockDefinition String representation of mock definition
   */
  public static toMockDefinition(
    mockDefinition: string
  ): Promise<MockDefinition> {
    return new Promise((resolve, reject) => {
      try {
        let content = JSON.parse(mockDefinition);
        if (!this.isMockDefinition(content)) {
          reject(['Invalid mock definition']);
        } else {
          content = {
            ...content,
            scenarios: content.scenarios.map(s => ({
              ...s,
              response: {
                ...s.response,
                headers: Json.objectToMap(s.response.headers)
              },
              requestMatchRules: {
                headerRules: Json.objectToMap(s.requestMatchRules.headerRules),
                queryRules: Json.objectToMap(s.requestMatchRules.queryRules),
                bodyRules: s.requestMatchRules.bodyRules
              }
            }))
          };
          resolve(content as MockDefinition);
        }
      } catch (error) {
        reject([error.message]);
      }
    });
  }

  /**
   * Return OpenAPI spec
   * If there were errors in validation it returns them as a map of errors
   * @returns OpenAPIV2.Document
   */
  public static toOpenApiSpec(openApi: string): Promise<OpenAPIV2.Document> {
    return new Promise((resolve, reject) => {
      try {
        const validator = new OpenAPISchemaValidator({ version: 2 });
        const content = yaml.safeLoad(openApi);
        const result = validator.validate(content);
        if (!result.errors || result.errors.length === 0) {
          resolve(content);
        } else {
          reject(
            result.errors.map(err => `${err.dataPath} ${err.message}`.trim())
          );
        }
      } catch (error) {
        reject(['file content is invalid yaml']);
      }
    });
  }

  /**
   * Check if the given object is mock definition
   * Supports OpenApiV2 Documents optional basePath and host properties
   * @param o Object to check if it is mock definition
   */
  public static isMockDefinition(o: any): o is MockDefinition {
    const u: MockDefinition = o;
    const seenScenarios = new Set();
    try {
      return (
        Array.isArray(u.scenarios) &&
        !u.scenarios.some(currentScenario => {
          return (
            seenScenarios.size === seenScenarios.add(currentScenario.id).size
          );
        }) &&
        u.scenarios.every(scenario => {
          return !scenario.response.body || JSON.parse(scenario.response.body);
        }) &&
        typeof u.metadata === 'object' &&
        u.metadata !== null &&
        typeof u.openApi === 'object' &&
        u.openApi !== null
      );
    } catch (error) {
      return false;
    }
  }

  /**
   * Exports the mock defnition as a json string
   */
  public static exportMockDefinition(mockDef: MockDefinition): string {
    const safeMockDef = Json.mapToObject(mockDef);
    return JSON.stringify(safeMockDef);
  }
}
