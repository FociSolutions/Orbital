import { Metadata } from './metadata.model';
import { Scenario } from './scenario/scenario.model';
import { OpenAPIV2 } from 'openapi-types';
import Json from '../json';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import yaml from 'js-yaml';

/**
 * Model representation of mock definition
 */
export class MockDefinition {
  metadata: Metadata;
  host?: string;
  basePath?: string;
  scenarios: Scenario[];
  openApi: OpenAPIV2.Document;

  /**
   * Takes a string of a map of mock definitions that have had all maps turned to objects and returns a Map of Mock Definitions
   * @param mockDefinitionMap a string of a map of mock definitions that have had all maps turned to objects
   */
  public static toMockDefinintionMap(
    mockDefinitionMap: string
  ): Map<string, MockDefinition> {
    const mockObject = JSON.parse(mockDefinitionMap) || new Map<string, MockDefinition>();
    const mockMap = Json.objectToMap(mockObject);
    for (const key in mockMap) {
      if (mockMap.hasOwnProperty(key)) {
        const element = mockMap[key];
        mockMap.set(key, this.objectToMockDefinition(element));
      }
    }
    return mockMap;
  }

  public static toMockDefinition(mockDefinition: string): MockDefinition {
    let content = JSON.parse(mockDefinition);
    if (!!content) {
      content = MockDefinition.objectToMockDefinition(content);
    }
    return content;
  }

  /**
   * Parse provided string to mock definition
   * @param mockDefinition String representation of mock definition
   */
  public static toMockDefinitionAsync(
    mockDefinition: string
  ): Promise<MockDefinition> {
    return new Promise((resolve, reject) => {
      try {
        let content = JSON.parse(mockDefinition);
        if (!this.isMockDefinition(content)) {
          reject(['Invalid mock definition']);
        } else {
          content = MockDefinition.objectToMockDefinition(content);
          resolve(content as MockDefinition);
        }
      } catch (error) {
        reject([error.message]);
      }
    });
  }

  /**
   * Takes an object that has had it's maps turned into objects and returns a MockDefinition
   * @param content a mock definition with objects instead of maps
   */
  public static objectToMockDefinition(content: any): MockDefinition {
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
    return content;
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
