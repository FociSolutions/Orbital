import { Injectable } from '@angular/core';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import { OpenAPIV2 } from 'openapi-types';
import { Observable } from 'rxjs';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root',
})
export class OpenApiSpecService {
  validatorV2: OpenAPISchemaValidator;
  validatorV3: OpenAPISchemaValidator;
  constructor() {
    this.validatorV2 = new OpenAPISchemaValidator({ version: 2 });
    this.validatorV3 = new OpenAPISchemaValidator({ version: 3 });
  }

  /**
   * Takes a string as input and returns an observable of type OpenAPIV2.Document
   * @param openApiString a string representing the open api file and turn contents into an OpenApiSpec
   * @returns observable object of type Open Api Document
   */
  readOpenApiSpec(openApiString: string): Observable<OpenAPIV2.Document> {
    return new Observable((observer) => {
      try {
        // eslint-disable-next-line @typescript-eslint/consistent-type-assertions
        const content: OpenAPIV2.Document = yaml.load(openApiString) as OpenAPIV2.Document;
        const result =
          content.swagger === '2.0' ? this.validatorV2.validate(content) : this.validatorV3.validate(content);

        if (result.errors.length) {
          observer.error(result.errors.map((err) => `${err.instancePath} ${err.message}`.trim()));
        } else {
          observer.next(content);
        }
      } catch (error) {
        observer.error(['file content is invalid yaml']);
      }
      observer.complete();
    });
  }
}
