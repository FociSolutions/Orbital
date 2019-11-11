import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OrbitalAdminService {
  private ROOT_URL = '/api/v1/OrbitalAdmin';
  constructor(private httpClient: HttpClient, private logger: NGXLogger) {}

  /**
   * POSTs a Mockdefinition to the server
   * @param url The url to post the mockdefinition to
   * @param mockdefinition The mockdefinition to be posted
   */
  addMockDefinition(
    url: string,
    mockdefinition: MockDefinition
  ): Observable<boolean> {
    this.logger.debug('Mockdefinition had been added: ', mockdefinition);
    return this.httpClient.post<boolean>(
      `${url}${this.ROOT_URL}`,
      mockdefinition
    );
  }
}
