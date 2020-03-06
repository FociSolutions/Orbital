import { Injectable } from '@angular/core';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError, forkJoin } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { timeout } from 'rxjs/operators';
import { NGXLogger } from 'ngx-logger';
import * as _ from 'lodash';
import { cloneDeep } from 'lodash';
import { HttpHeaders, HttpClient } from '@angular/common/http';
import { state } from '@angular/animations';
import { DesignerStore } from '../../store/designer-store';
import { recordMap } from '../../models/record';

@Injectable({
  providedIn: 'root'
})
export class ExportMockdefinitionService {
  urlCache: string;
  mockdefinitionCache: MockDefinition;
  constructor(private store: DesignerStore, private httpClient: HttpClient, private logger: NGXLogger) {
    // tslint:disable-next-line: no-shadowed-variable
    this.store.state$.subscribe(state => {
      if (!!state.mockDefinition) {
        this.mockdefinitionCache = state.mockDefinition;
      }
    });
  }

  /**
   * Access to Url for Quick Export
   */
  getUrl(): string {
    return this.urlCache;
  }

  /**
   * Access to Mockdefinition for Quick Export
   */
  getMockdefinition(): MockDefinition {
    return this.mockdefinitionCache;
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
    this.urlCache = url;
    this.mockdefinitionCache = mockDefinitionToExport;
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
  exportMockDefinitions(url: string, mockdefinitions: MockDefinition[]): Observable<boolean[]> {
    return forkJoin(mockdefinitions.map(mockdefinition => this.exportMockDefinition(url, mockdefinition)));
  }
}
