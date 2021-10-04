import { Injectable } from '@angular/core';
import OpenAPISchemaValidator from 'openapi-schema-validator';
import { OpenAPIV2 } from 'openapi-types';
import { Observable } from 'rxjs';
import * as yaml from 'js-yaml';

@Injectable({
  providedIn: 'root'
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
    return new Observable(observer => {
      try {
        const content = yaml.safeLoad(openApiString) as any;
        let result;
        if (content.swagger === '2.0') {
          result = this.validatorV2.validate(content);
        } else {
          result = this.validatorV3.validate(content);
        }

        if (!result.errors || result.errors.length === 0) {
          observer.next(content);
        } else {
          observer.error(result.errors.map(err => `${err.dataPath} ${err.message}`.trim()));
        }
      } catch (error) {
        observer.error(['file content is invalid yaml']);
      }
      observer.complete();
    });
  }
}
