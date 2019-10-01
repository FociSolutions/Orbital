import { Component, OnInit } from '@angular/core';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { EndpointsStore } from 'src/app/store/endpoints-store';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/models/endpoint.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';
import { OrbitalServerService } from 'src/app/services/orbital-server.service';

@Component({
  selector: 'app-endpoint-overview',
  templateUrl: './endpoint-overview.component.html',
  styleUrls: ['./endpoint-overview.component.scss']
})
export class EndpointOverviewComponent implements OnInit {
  constructor(
    private mockDefinitionStore: MockDefinitionStore,
    private endpointsStore: EndpointsStore,
    private router: Router,
    private orbitalService: OrbitalServerService,
    private app: AppStore
  ) {
    this.mockDefinitionStore.state$.subscribe(mockDefinition => {
      this.mockDefinition = {
        ...mockDefinition,
        scenarios: [...mockDefinition.scenarios]
      };
    });
    this.endpointsStore.state$.subscribe(endpoints => {
      this.endpoints = endpoints;
    });
    this.app.state$.subscribe(state => {
      this.shouldShowOverview = !state.showEditor;
      this.selectedScenario = state.selectedScenario;
      this.selectedEndpoint = state.selectedEndpoint;
    });
    this.app.selectedEndpoint = this.endpoints[0];
  }
  // This is just a placeholder to show component toggle
  shouldShowOverview = true;
  mockDefinition: MockDefinition;
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;

  /**
   * Handles logic for exporting a mockservice file directly to the server
   */

  tcode: string;

  ngOnInit() {}

  /**
   * Handle onClick event for export mock file button
   */
  onExportClicked() {
    const blob = this.exportMockDefinition();
    const a = document.createElement('a');
    a.download = this.mockDefinition.metadata.title + `.mock.json`;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [a.download, a.href].join(':');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  exportMockDefinition() {
    const content = MockDefinition.exportMockDefinition(this.mockDefinition);
    const blob = new Blob([content]);
    return blob;
  }

  /**
   * Handles back button for navigation to previous pages and components
   */
  onBack() {
    if (this.app.state.showEditor) {
      this.app.showEditor = false;
    } else {
      this.router.navigate(['/']);
    }
  }
  onServerExport() {
    this.orbitalService
      .onServerExport(this.tcode, this.exportMockDefinition())
      .subscribe(
        resp => {
          alert('The export has been sent successfully!');
          const element = document.getElementById('CloseButton') as any;
          element.click();
        },
        error => {
          // the window is not closed when there is an error in-case the user mistyped the url
          alert(
            'An error has occurred and the export could not be completed with status: ' +
              error.status
          );
        }
      );
  }
}
