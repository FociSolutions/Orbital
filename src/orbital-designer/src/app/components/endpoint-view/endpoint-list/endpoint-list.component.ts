import { Component, OnInit } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Endpoint } from 'src/app/models/endpoint.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.scss']
})
export class EndpointListComponent implements OnInit {
  endpoints: Endpoint[];

  constructor(private designerStore: DesignerStore) {
    this.designerStore.state$.subscribe(state => this.endpoints = state.endpoints);
  }

  get scenarios(): Scenario[] {
    return this.designerStore.state.mockDefinition.scenarios;
  }

  ngOnInit() {
  }

}
