import { Component, OnInit, Input } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';
import { Endpoint } from 'src/app/models/endpoint.model';

@Component({
  selector: 'app-scenario-view',
  templateUrl: './scenario-view.component.html',
  styleUrls: ['./scenario-view.component.scss']
})
export class ScenarioViewComponent implements OnInit {
  selectedEndpoint: Endpoint;
  mockdefinition: MockDefinition;

  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.mockdefinition = state.mockDefinition;
      this.selectedEndpoint = state.selectedEndpoint;
    });
  }

  ngOnInit() {}
}
