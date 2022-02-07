import { Component, Input } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { Router } from '@angular/router';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss'],
})
export class EndpointListItemComponent {
  @Input() endpoint: Endpoint;
  @Input() scenarioCount: number;

  constructor(private store: DesignerStore, private logger: NGXLogger, private router: Router) {}

  /**
   * Returns a list of scenarios for the clicked endpoint
   */

  selectEndpoint() {
    this.store.selectedEndpoint = this.endpoint;
    this.router.navigateByUrl('/scenario-view');
    this.logger.debug('Endpoint selected: ', this.store.state.selectedEndpoint);
  }

  /**
   * Gets the endpoint's description
   */
  get endpointDescription(): string {
    return !this.endpoint || !this.endpoint.spec.description ? 'No description' : this.endpoint.spec.description;
  }

  get scenarioDisplay(): string {
    let display = `${this.scenarioCount} Scenario`;
    if (this.scenarioCount !== 1) {
      display += 's';
    }
    return display;
  }
}
