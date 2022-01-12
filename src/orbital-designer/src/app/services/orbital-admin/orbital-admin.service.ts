import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, forkJoin, throwError } from 'rxjs';
import { catchError, map, timeout } from 'rxjs/operators';
import { cloneDeep } from 'lodash';
import * as HttpStatus from 'http-status-codes';

@Injectable({
  providedIn: 'root',
})
export class OrbitalAdminService {
  readonly http_request_timeout_ms = 3000;

  constructor(private httpClient: HttpClient, private logger: NGXLogger) {}

  /**
   * Sends a GET request to get a mock definition; the URL should not have a trailing slash
   * @param url The url to send the GET request to
   * @param id The mock definition id to get
   */
  get(url: string, id: string): Observable<MockDefinition> {
    this.logger.debug(`Sent GET request to ${url}/${id}`);
    return this.httpClient.get<MockDefinition>(`${url}/${id}`).pipe(timeout(this.http_request_timeout_ms));
  }

  /**
   * Sends a GET all request to a specified server
   * @param url The url to send the GET request to
   */
  getAll(url: string): Observable<MockDefinition[]> {
    this.logger.debug(`Sent GET request to ${url}`);

    return this.httpClient.get<MockDefinition[]>(url).pipe(timeout(this.http_request_timeout_ms));
  }

  /**
   * POSTs a Mockdefinition to the server
   * @param url The url to post the mockdefinition to
   * @param mockdefinition The mockdefinition to be posted
   */
  exportMockDefinition(url: string, mockdefinition: MockDefinition): Observable<boolean> {
    this.logger.debug('Mockdefinition has been exported: ', mockdefinition);
    const mockDefinitionToExport = cloneDeep(mockdefinition);

    this.logger.debug('Mockdefinition in JSON format: ', mockDefinitionToExport);

    return this.httpClient
      .post<boolean>(url, mockDefinitionToExport, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8',
        }),
      })
      .pipe(
        catchError((error) => {
          return throwError(error);
        })
      );
  }

  /**
   * @param url The url to post the Mockdefinitions to
   * POSTs a list of Mockdefinitions to the server
   * @param mockdefinitions The mockdefinitions to export
   */
  exportMockDefinitions(url: string, mockdefinitions: MockDefinition[]): Observable<boolean[]> {
    return forkJoin(mockdefinitions.map((mockdefinition) => this.exportMockDefinition(url, mockdefinition)));
  }

  /**
   * Removes the specified mock definition from the orbital server
   *
   * @param url the orbital server url
   * @param mockDefId the title of the mock definition that will be removed
   * @returns a boolean indicating if the mockdefinition was removed successfully both the orbital server.
   */
  deleteMockDefinition(url: string, mockDefId: string): Observable<boolean> {
    const fullURL = `${url}/${mockDefId}`;

    return this.httpClient
      .delete<boolean>(fullURL, { headers: new HttpHeaders({}), observe: 'response', responseType: 'json' })
      .pipe(
        catchError((error) => {
          this.logger.error(error);
          return throwError(error);
        }),
        map((deleteMockResult) => deleteMockResult.status === HttpStatus.StatusCodes.OK)
      );
  }

  /**
   * @param url The url to delete the Mockdefinitions from
   * Deletes a list of Mockdefinitions to the server
   * @param mockdefinitions The mockdefinitions to delete
   */
  deleteMockDefinitions(url: string, mockdefinitions: string[]): Observable<boolean[]> {
    return forkJoin(mockdefinitions.map((mockdefinition) => this.deleteMockDefinition(url, mockdefinition)));
  }
}
