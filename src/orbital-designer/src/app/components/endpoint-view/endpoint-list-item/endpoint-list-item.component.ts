import { Component, OnInit, Input } from '@angular/core';
import { Scenario } from 'src/app/models/mock-definition/scenario/scenario.model';

@Component({
  selector: 'app-endpoint-list-item',
  templateUrl: './endpoint-list-item.component.html',
  styleUrls: ['./endpoint-list-item.component.scss']
})
export class EndpointListItemComponent implements OnInit {
  @Input() scenario: Scenario;

  constructor() { }

  ngOnInit() {
  }

}
