import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { Endpoint } from 'src/app/models/endpoint.model';

@Component({
  selector: 'app-endpoint-view',
  templateUrl: './endpoint-view.component.html',
  styleUrls: ['./endpoint-view.component.scss']
})
export class EndpointViewComponent implements OnInit {
  mockDefinition: MockDefinition;
  endpointList: Endpoint[] = [];
  filteredList: Endpoint[] = [];

  constructor(private store: DesignerStore) {
    this.store.state$.subscribe(state => {
      this.mockDefinition = state.mockDefinition;
      this.endpointList = [...state.endpoints];
    });
    this.filteredList = this.endpointList;
  }

  endpointToString(endpoint: Endpoint): string {
    return endpoint.path;
  }

  setFilteredList(endpoints: Endpoint[]) {
    this.filteredList = endpoints;
  }

  ngOnInit() {}
}
