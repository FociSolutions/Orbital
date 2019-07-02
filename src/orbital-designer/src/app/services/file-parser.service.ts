import { Injectable } from '@angular/core';
import { MockDefinition } from '../models/mock-definition/mock-definition.model';
import { OpenAPIV2 } from 'openapi-types';

@Injectable({
  providedIn: 'root'
})
export class FileParserService {

  constructor() { }

  /**
   * Reads a file as mock definition
   * @param file File containing mock definition
   * @returns promise containing either the resulting mock definition or an error
   */
  readMockDefinition(file: File): Promise<MockDefinition> {
    return new Promise((resolve, reject) => {
      this.read(file).then(contentString => {
        MockDefinition.toMockDefinition(contentString).then(
          result => resolve(result),
          err => reject(err)
        );
      });
    });
  }

  /**
   * Takes a file as input and returns a promise that will resolve to an OpenAPIV2.Document
   * if the file is valid. If the file is invalid it will reject an error.
   * @param file an Object representing the file to read and turn contents into an OpenApiSpec
   * @returns promise containing an object with the Open Api Document and content string or an error
   */
  readOpenApiSpec(file: File): Promise<{doc: OpenAPIV2.Document, contentString: string}> {
    return new Promise((resolve, reject) => {
      this.read(file).then(
        contentString => {
          MockDefinition.toOpenApiSpec(contentString).then (
            doc => resolve({doc, contentString}),
            err => reject(err)
          );
        }
      );
    });
  }

  /**
   * Takes a file as input and returns a promise that will resolve to a string representing
   * the contents of the file
   * @param file an Object representing the file to read
   * @returns a promise containing a string representing the file contents
   */
  read(file: File): Promise<string> {
    return new Promise( (resolve, reject) => {
      const fileContent = new FileReader();
      fileContent.readAsText(file);
      fileContent.onload = () => {
        const contentString = fileContent.result as string;
        resolve(contentString);
      };
    });
  }
}
