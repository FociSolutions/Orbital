import { Component, OnInit, Input } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss']
})
export class EndpointListItemComponent implements OnInit {
  @Input() endpoint: Endpoint;
  @Input() scenarioCount: number;

  constructor() { }

  ngOnInit() {
  }

  get endpointDescription(): string {
    return (!this.endpoint || !this.endpoint.spec.description) ? 'No description' :  this.endpoint.spec.description;
  }
 
}
