import { Injectable } from '@angular/core';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { HttpHeaders, HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ExportMockdefinitionService {

  constructor(private httpClient: HttpClient, private logger: NGXLogger) { }

  /**
   * Sends a GET request to get a mock definition; the URL should not have a trailing slash
   * @param url The url to send the GET request to
   * @param id The mock definition id to get
   */
  get(url: string, id: string): Observable<MockDefinition> {
    this.logger.debug('Sent GET request to ' + url + '/' + id);
    return this.httpClient
      .get<MockDefinition>(url + '/' + id)
      .pipe(timeout(3000));
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

    this.logger.debug(
      'Mockdefinition in JSON format: ',
      mockDefinitionToExport
    );

    return this.httpClient
      .post<boolean>(url, mockDefinitionToExport, {
        headers: new HttpHeaders({
          'Content-Type': 'application/json; charset=utf-8'
        })
      })
      .pipe(
        catchError(error => {
          return throwError(error);
        })
      );
  }

  /**
   * @param mockdefinition The Mockdefinitions to be posted
   * @param url The url to post the Mockdefinitions to
   * POSTs a list of Mockdefinitions to the server
   */
  exportMockDefinitions(
    url: string,
    mockdefinitions: MockDefinition[]
  ): Observable<boolean[]> {
    return forkJoin(mockdefinitions.map(mockdefinition =>
      this.exportMockDefinition(url, mockdefinition)
    ));
  }
}

