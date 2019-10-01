import { Component, OnInit, Input } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { GetEndpointScenariosPipe } from '../../../pipes/get-endpoint-scenarios/get-endpoint-scenarios.pipe';
import * as HttpStatus from 'http-status-codes';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss']
})
export class EndpointListItemComponent implements OnInit {
  private store: DesignerStore;
  @Input() endpoint: Endpoint;
  @Input() scenarioCount: number;

  constructor(private designerStore: DesignerStore, private logger: NGXLogger) {
    this.store = designerStore;
  }

  ngOnInit() {}

  /**
   * Returns a list of scenarios for the clicked endpoint
   */

  selectEndpoint() {
    this.store.state.selectedEndpoint = this.endpoint;
    console.log(this.store.state.selectedEndpoint);
  }

  get endpointDescription(): string {
    return !this.endpoint || !this.endpoint.spec.description
      ? 'No description'
      : this.endpoint.spec.description;
  }
}
