import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
@Injectable({
  providedIn: 'root'
})
export class OrbitalAdminService {
  // private ROOT_URL = '/api/v1/OrbitalAdmin';
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
    return this.httpClient.post<boolean>(`${url}`, mockdefinition).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
