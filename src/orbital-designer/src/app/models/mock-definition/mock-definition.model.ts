import { Metadata } from './metadata.model';
import { Scenario } from './scenario/scenario.model';
import * as yaml from 'js-yaml';
import { OpenAPIV2 } from 'openapi-types';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import Yaml from '../yaml';
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
        let content = yaml.safeLoad(mockDefinition);
        if (!this.isMockDefinition(content)) {
          reject('Invalid mock definition');
        } else {
          content = {
            ...content,
            scenarios: content.scenarios.map(s => ({
              ...s,
              response: {
                ...s.response,
                headers: new Map(s.response.headers)
              },
              requestMatchRules: {
                headerRules: new Map(s.requestMatchRules.headerRules),
                queryRules: new Map(s.requestMatchRules.queryRules),
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
   * @param o Object to check if it is mock definition
   */
  private static isMockDefinition(o: any): o is MockDefinition {
    const u: MockDefinition = o;
    return (
      typeof u.basePath === 'string' &&
      Array.isArray(u.scenarios) &&
      typeof u.host === 'string' &&
      typeof u.metadata === 'object' &&
      u.metadata !== null &&
      typeof u.openApi === 'object' &&
      u.openApi !== null
    );
  }

  /**
   * Exports the mock definition as a yaml string
   */
  public static exportMockDefinitionAsYaml(mockDef: MockDefinition): string {
    const safeMockDef = Yaml.collectionToArray(mockDef);
    return yaml.safeDump(safeMockDef);
  }

  /**
   * Exports the mock definition as a json string
   */
  public static exportMockDefinitionAsJson(mockDef: MockDefinition): string {
    const safeMockDef = Json.mapToObject(mockDef);
    return JSON.stringify(safeMockDef);
  }

  public static exportMockDefinition(
    mockDef: MockDefinition,
    fileType: string
  ): string {
    switch (fileType) {
      case 'yml':
        return this.exportMockDefinitionAsYaml(mockDef);
      case 'json':
        return this.exportMockDefinitionAsJson(mockDef);
      default:
        throw new Error('Unsupported File Type');
    }
  }
}
