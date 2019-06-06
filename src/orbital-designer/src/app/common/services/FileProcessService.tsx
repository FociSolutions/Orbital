import {
  MockDefinition,
  toOpenApiSpec,
  toMockDefinition
} from '../../common/models/mockDefinition/MockDefinition';
import { OpenAPIV2 } from 'openapi-types';

/**
 * Read file as mock definition
 * @param file File containing mock definition
 * @returns promise containing either the result or the error
 */
export function readMockDefinition(file: File): Promise<MockDefinition> {
  return new Promise((resolve, reject) => {
    read(file).then(contentString => {
      toMockDefinition(contentString).then(
        result => resolve(result),
        err => reject(err)
      );
    });
  });
}

/**
 * Read file as OpenAPI spec
 * @param file File containing OpenAPI spec
 * @returns promise containing either the result or the error
 */
export function readOpenApiSpec(file: File): Promise<OpenAPIV2.Document> {
  return new Promise((resolve, reject) => {
    read(file).then(contentString => {
      toOpenApiSpec(contentString).then(
        result => resolve(result),
        err => reject(err)
      );
    });
  });
}

/**
 * Read file content as string
 * @param file File to read
 * @returns a promise containing the file content
 */
function read(file: File): Promise<string> {
  var fileContent = new FileReader();
  fileContent.readAsText(file);
  return new Promise((resolve, _reject) => {
    fileContent.onload = () => {
      var contentString = fileContent.result as string;
      resolve(contentString);
    };
  });
}

export default read;
