import { Injectable } from '@angular/core';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError, of, from } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import Json from '../../../app/models/json';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OrbitalAdminService {
  constructor(private httpClient: HttpClient,
              private logger: NGXLogger) {}


  /**
   * Sends a GET request to get a mock definition; the URL should not have a trailing slash
   * @param url The url to send the GET request to
   * @param id The mock definition id to get
   */
  get(url: string, id: string): Observable<MockDefinition> {
    this.logger.debug('Sent GET request to ' + url + '/' + id);
    return this.httpClient.get<MockDefinition>(url + '/' + id).pipe(timeout(3000));
  }

  /**
   * Sends a GET all request to a specified server
   * @param url The url to send the GET request to
   */
  getAll(url: string): Observable<MockDefinition[]> {
    this.logger.debug('Sent GET request to ' + url);

    return this.httpClient.get<MockDefinition[]>(url).pipe(timeout(3000));
  }


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
   * @param mockdefinition The mockdefinitions to be posted
   * @param url The url to post the mockdefinitions to
   * POSTs a list of Mockdefinitions to the server
   */
  exportMockDefinitions(
    url: string,
    mockdefinitions: MockDefinition[]
    ): Observable<boolean>[] {
      return mockdefinitions.map((mockdefinition) => this.exportMockDefinition(url, mockdefinition));
  }

/**
 * Removes the specified mock definition from the orbital server
 *
 * @param url the orbital server url
 * @param mockDefId the title of the mock definition that will be removed
 * @returns a boolean indicating if the mockdefinition was removed successfully both the orbital server.
 */
  deleteMockDefinition(
    url: string,
    mockDefId: string
  ): Observable<boolean> {
    const fullURL = url + '/' + mockDefId;

    return  this.httpClient
      .delete<boolean>(fullURL)
      .pipe(
        catchError(error => {
          this.logger.error(error);
          return throwError(error);
        })
      );
  }


 /**
  * Remove multiple MockDefinitions by title
  * @param url string representation of the orbital server url
  * @param mockDefIds string arrays containing the mock definition titles to be deleted
  * @returns flag to indicate if the deletion of all mock definitions was successful
  */
  deleteMultipleMockDefinitions(
    url: string,
    mockDefIds: string[]
  ): boolean {
      let success = true;
      mockDefIds.forEach(id => {
        this.deleteMockDefinition(url, id).subscribe(
          () => {},
          error => success = false
      );
    });

      return success;
  }


}
