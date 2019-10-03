import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Endpoint } from 'src/app/models/endpoint.model';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit {
  selectedEndpoint: Endpoint;
  mockDefinition: MockDefinition;

  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.selectedEndpoint = state.selectedEndpoint;
      this.mockDefinition = state.mockDefinition;
    });
  }

  ngOnInit() {}
}
