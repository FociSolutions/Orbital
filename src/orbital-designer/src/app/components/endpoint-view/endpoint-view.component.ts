import { Component, OnInit, NgZone, ChangeDetectorRef } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Endpoint } from 'src/app/models/endpoint.model';
import { OrbitalAdminService } from 'src/app/services/orbital-admin/orbital-admin.service';
import { NGXLogger } from 'ngx-logger';
import { HttpRequest } from '@angular/common/http';

@Component({
  selector: 'app-endpoint-view',
  templateUrl: './endpoint-view.component.html',
  styleUrls: ['./endpoint-view.component.scss']
})
export class EndpointViewComponent implements OnInit {
  mockDefinition: MockDefinition;
  endpointList: Endpoint[] = [];
  filteredList: Endpoint[] = [];
  httpRequest: HttpRequest<MockDefinition>;
  serverUri: string;
  uriRegex =
    '^(http://www.|https://www.|http://|https://)?[a-z0-9]+([-.]{1}[a-z0-9]+)*.[a-z]{2,5}(:[0-9]{1,5})?(/.*)?$';
  isExportedMessage: string;

  constructor(
    private store: DesignerStore,
    private orbitalAdminService: OrbitalAdminService,
    private logger: NGXLogger
  ) {
    this.store.state$.subscribe(state => {
      this.mockDefinition = state.mockDefinition;
      this.endpointList = [...state.endpoints];
    });
    this.isExportedMessage = '';
  }
  /**
   * This function takes an endpoint object and return its path as a string
   * @param endpoint The endpoint to be converted to string
   */
  endpointToString(endpoint: Endpoint): string {
    return endpoint.path;
  }
  /**
   * This function takes a list of endpoints and updates it to the new list of filtered endpoints
   * @param endpoints The list of endpoints
   */
  setFilteredList(endpoints: Endpoint[]) {
    this.filteredList = endpoints;
  }

  /**
   * The function checks if there's matched scenario(s) found when searching.
   * Search is done by the search bar component.
   */
  showNotFound() {
    return this.filteredList.length === 0;
  }

  /**
   * Subscribes the OrbitalAdminService to POST a Mockdefinition to the server
   */
  onSubmit() {
    this.orbitalAdminService
      .exportMockDefinition(this.serverUri, this.mockDefinition)
      .subscribe(
        data => {
          this.logger.log(data);
          this.isExportedMessage =
            'Mockdefinition successfully uploaded to server';
        },
        error => {
          this.logger.error('Error', error);
          this.isExportedMessage =
            'Error uploading Mockdefinition to server: ' + error.statusText;
        }
      );
  }

  ngOnInit() {}
}
