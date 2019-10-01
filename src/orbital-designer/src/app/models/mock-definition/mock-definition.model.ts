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
  host: string;
  basePath: string;
  scenarios: Scenario[] = [];
  openApi: any;

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
          reject('Invalid mock definition');
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
        reject(error);
      }
    });
  }

  /**
   * Return OpenAPI spec
   * @returns OpenAPIV2.Document
   */
  public static toOpenApiSpec(openApi: string): Promise<OpenAPIV2.Document> {
    return new Promise((resolve, reject) => {
      try {
        const validator = new OpenAPISchemaValidator({ version: 2 });
        const content = yaml.safeLoad(openApi);
        const result = validator.validate(content);
        if (!result.errors || result.errors.length < 1) {
          resolve(content);
        } else {
          reject('Invalid OpenAPI spec');
        }
      } catch (error) {
        reject(error);
      }
    });
  }

  /**
   * Check if the given object is mock definition
   * Supports OpenApiV2 Documents optional basePath and host properties
   * @param o Object to check if it is mock definition
   */
  private static isMockDefinition(o: any): o is MockDefinition {
    const u: MockDefinition = o;
    return (
      Array.isArray(u.scenarios) &&
      typeof u.metadata === 'object' &&
      u.metadata !== null &&
      typeof u.openApi === 'object' &&
      u.openApi !== null
    );
  }

  /**
   * Exports the mock defnition as a json string
   */
  public static exportMockDefinition(mockDef: MockDefinition): string {
    const safeMockDef = Json.mapToObject(mockDef);
    return JSON.stringify(safeMockDef);
  }
}
