import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'app-shuttle-list',
  templateUrl: './shuttle-list.component.html',
  styleUrls: ['./shuttle-list.component.scss']
})
export class ShuttleListComponent implements OnInit {
  @Input() leftTitle = '';
  @Input() rightTitle = '';

  constructor() {}

  ngOnInit() {}
}
