import { Component, OnInit, Input } from '@angular/core';
import { DesignerStore } from 'src/app/store/designer-store';
import { Endpoint } from 'src/app/models/endpoint.model';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.scss']
})
export class EndpointListComponent implements OnInit {
  @Input() endpoints: Endpoint[] = [];

  constructor(private designerStore: DesignerStore) {}

  /**
   * Retrieves the list of scenarios from the store
   */
  get scenarios(): Scenario[] {
    return this.designerStore.state.mockDefinition.scenarios;
  }

  ngOnInit() {}
}
