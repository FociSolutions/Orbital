import { Component, OnInit, Input } from '@angular/core';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-endpoint-list',
  templateUrl: './endpoint-list.component.html',
  styleUrls: ['./endpoint-list.component.scss']
})
export class EndpointListComponent implements OnInit {
  @Input() scenarios: Scenario[];

  constructor() { }

  ngOnInit() {
  }

}
