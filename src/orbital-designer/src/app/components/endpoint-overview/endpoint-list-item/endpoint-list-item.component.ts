import { Component, OnInit, Input } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { VerbType } from 'src/app/models/verb.type';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss']
})
export class EndpointListItemComponent implements OnInit {
  endpoint: Endpoint;
  badgeColor: string;

  constructor() {}

  ngOnInit() {}

  /**
   * Handle on click for current list item
   */
  onItemSelected() {}

  /**
   * setter for endpoint list item and its badge color
   */
  @Input()
  set item(item: Endpoint) {
    this.endpoint = item;
    switch (this.endpoint.verb) {
      case VerbType.DELETE:
        this.badgeColor = 'danger';
        break;
      case VerbType.GET:
        this.badgeColor = 'info';
        break;
      case VerbType.POST:
        this.badgeColor = 'success';
        break;
      case VerbType.PUT:
        this.badgeColor = 'warning';
        break;
    }
  }
}
