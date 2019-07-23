import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { VerbType } from 'src/app/models/verb.type';
import { AppStore } from 'src/app/store/app-store';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss']
})
export class EndpointListItemComponent implements OnInit {
  @Input() endpoint: Endpoint;
  selected: boolean;

  constructor(private app: AppStore) {
    this.app.state$.subscribe(state => {
      this.selected = state.selectedEndpoint === this.endpoint;
    });
  }

  ngOnInit() {}
}
