import { Component, OnInit } from '@angular/core';
import { Endpoint } from 'src/app/models/endpoint.model';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.scss']
})
export class EndpointListComponent implements OnInit {
  endpoints: Endpoint[];

  constructor() {}

  ngOnInit() {}
}
