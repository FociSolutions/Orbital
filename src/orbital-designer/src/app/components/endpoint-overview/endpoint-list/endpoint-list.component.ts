import { Component, OnInit } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';
import { EndpointsStore } from 'src/app/store/endpoints-store';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.scss']
})
export class EndpointListComponent implements OnInit {
  endpoints: Endpoint[];

  constructor(private store: EndpointsStore) {}

  ngOnInit() {
    this.store.state$.subscribe(state => {
      this.endpoints = state.endpoints;
    });
  }
}
