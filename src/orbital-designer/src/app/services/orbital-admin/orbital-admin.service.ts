import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import Json from '../../../app/models/json';
import { cloneDeep } from 'lodash';

@Injectable({
  providedIn: 'root'
})
export class OrbitalAdminService {
  constructor(private httpClient: HttpClient,
              private logger: NGXLogger) {}

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
 * @param mockDefIds string arrays containing the mock definition titles to be delted
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
