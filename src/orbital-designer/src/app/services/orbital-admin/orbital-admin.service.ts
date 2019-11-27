import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import Json from '../../../app/models/json';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OrbitalAdminService {
  constructor(private httpClient: HttpClient, private logger: NGXLogger) {}

  /**
   * POSTs a Mockdefinition to the server
   * @param url The url to post the mockdefinition to
   * @param mockdefinition The mockdefinition to be posted
   */
  exportMockDefinition(
    url: string,
    mockdefinition: MockDefinition
  ): Observable<boolean> {
    this.logger.debug('Mockdefinition has been exported: ', mockdefinition);
    const mockDefinitionToExport = cloneDeep(mockdefinition);

    if (mockDefinitionToExport.scenarios != null) {
      mockDefinitionToExport.scenarios.forEach(scenario => {
        if (
          scenario.requestMatchRules != null &&
          scenario.requestMatchRules.bodyRules != null
        ) {
          scenario.requestMatchRules.bodyRules.forEach(bodyRule => {
            switch (bodyRule.type) {
              case 'bodyEquality':
                bodyRule.type = 1;
                break;
              case 'bodyContains':
                bodyRule.type = 2;
                break;
            }
          });
        }
      });
    }

    return this.httpClient
      .post<boolean>(url, Json.mapToObject(mockDefinitionToExport))
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * Sends a GET all request to a specified server
   * @param url The url to send the GET request to
   */
  getAll(url: string): Observable<HttpEvent<unknown>> {
    const request = new HttpRequest(
      'GET',
      url
    );

    this.logger.debug('Sent GET request to ' + url);
    return this.httpClient.request(request).pipe(timeout(3000));
  }

  /**
   * Sends a GET request to get a mock definition; the URL should not have a trailing slash
   * @param url The url to send the GET request to
   * @param id The mock definition id to get
   */
  get(url: string, id: string): Observable<HttpEvent<unknown>> {
    const request = new HttpRequest(
      'GET',
      url + '/' + id
    );

    this.logger.debug('Sent GET request to ' + url + '/' + id);
    return this.httpClient.request(request).pipe(timeout(3000));
  }
}
