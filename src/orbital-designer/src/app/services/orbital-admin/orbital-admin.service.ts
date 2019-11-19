import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { BodyRuleType } from 'src/app/models/mock-definition/scenario/body-rule.type';
import Json from '../../../app/models/json';

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
    const mockDefinitionToExport = JSON.parse(MockDefinition.exportMockDefinition(mockdefinition));

    if (mockDefinitionToExport.scenarios != null) {
      mockDefinitionToExport.scenarios.forEach((scenario) => {
        if (scenario.requestMatchRules != null && scenario.requestMatchRules.bodyRules != null) {
          scenario.requestMatchRules.bodyRules.forEach((bodyRule) => {
            switch (bodyRule.type) {
              case 'bodyEquality':
                bodyRule.type = 1;
                break;
              case 'bodyContains':
                bodyRule.type = 2;
                break;
              case 'bodyIgnore':
                bodyRule.type = 3;
                break;
            }
          });
        }
      });
    }

    return this.httpClient.post<boolean>(url, Json.mapToObject(mockDefinitionToExport)).pipe(
      catchError(error => {
        return throwError(error);
      })
    );
  }
}
