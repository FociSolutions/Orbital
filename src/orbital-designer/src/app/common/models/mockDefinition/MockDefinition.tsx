import { Endpoint } from './Endpoint';
import { Metadata } from './Metadata';
import yaml from 'js-yaml';
import { OpenAPIV2 } from 'openapi-types';
import OpenAPISchemaValidator from 'openapi-schema-validator';

export interface MockDefinition {
  metadata: Metadata;
  host: string;
  basePath: string;
  endpoints: Endpoint;
  openApi: string;
}

/**
 * Parse string to a mock definition
 * @param mockDefinition String representation of mock definition
 * @returns promise containing either the result or the error
 */
export function toMockDefinition(
  mockDefinition: string
): Promise<MockDefinition> {
  return new Promise((resolve, reject) => {
    try {
      var content = yaml.safeLoad(mockDefinition);
      if (!isMockDefinition(content)) {
        reject('Invalid mock definition');
      } else {
        resolve(content);
      }
    } catch (error) {
      reject(error);
    }
  });
}

/**
 * Parse string to an openAPI spec
 * @param openApi String representation of openAPI spec
 */
export function toOpenApiSpec(openApi: string): Promise<OpenAPIV2.Document> {
  var validator = new OpenAPISchemaValidator({ version: 2 });
  return new Promise((resolve, reject) => {
    try {
      var content = yaml.safeLoad(openApi);
      var result = validator.validate(content);
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
 * Check if the given object is a mock definition
 * @param o Object to check it if is a mock definition
 */
export function isMockDefinition(o: any): o is MockDefinition {
  const u: MockDefinition = o;
  return (
    typeof u.basePath === 'string' &&
    typeof u.endpoints === 'object' &&
    typeof u.host === 'string' &&
    typeof u.metadata === 'object' &&
    typeof u.openApi === 'string'
  );
}
