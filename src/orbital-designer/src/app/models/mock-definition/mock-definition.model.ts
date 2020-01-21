import { Metadata } from './metadata.model';
import { Scenario } from './scenario/scenario.model';
import { OpenAPIV2 } from 'openapi-types';
import Json from '../json';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import * as yaml from 'js-yaml';

/**
 * Model representation of mock definition
 */
export class MockDefinition {
  metadata: Metadata;
  host?: string;
  basePath?: string;
  scenarios: Scenario[];
  openApi: OpenAPIV2.Document;

  public static toMockDefinition(mockDefinition: string): MockDefinition {
    const content = JSON.parse(mockDefinition);
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
        const content = JSON.parse(mockDefinition);
        if (!this.isMockDefinition(content)) {
          reject(['Invalid mock definition']);
        } else {
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
    return JSON.stringify(mockDef);
  }
}
