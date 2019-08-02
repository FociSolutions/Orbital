import { Component, OnInit } from '@angular/core';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { EndpointsStore } from 'src/app/store/endpoints-store';
import { Router } from '@angular/router';
import { Endpoint } from 'src/app/models/endpoint.model';
import {
  Scenario,
  newScenario
} from 'src/app/models/mock-definition/scenario/scenario.model';
import { AppStore } from 'src/app/store/app-store';

@Component({
  selector: 'app-endpoint-overview',
  templateUrl: './endpoint-overview.component.html',
  styleUrls: ['./endpoint-overview.component.scss']
})
export class EndpointOverviewComponent implements OnInit {
  // This is just a placeholder to show component toggle
  shouldShowOverview = true;
  mockDefinition: MockDefinition;
  endpoints: Endpoint[];
  selectedEndpoint: Endpoint;
  selectedScenario: Scenario;

  constructor(
    private mockDefinitionStore: MockDefinitionStore,
    private endpointsStore: EndpointsStore,
    private router: Router,
    private app: AppStore
  ) {
    this.mockDefinitionStore.state$.subscribe(mockDefinition => {
      this.mockDefinition = mockDefinition;
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

  ngOnInit() {}

  /**
   * Handle onClick event for export mock file button
   */
  onExportClicked(fileType: string) {
    const content = MockDefinition.exportMockDefinition(
      this.mockDefinition,
      fileType
    );
    const blob = new Blob([content]);
    const a = document.createElement('a');
    a.download = this.mockDefinition.metadata.title + `.mock.${fileType}`;
    a.href = URL.createObjectURL(blob);
    a.dataset.downloadurl = [a.download, a.href].join(':');
    a.style.display = 'none';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
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
}
