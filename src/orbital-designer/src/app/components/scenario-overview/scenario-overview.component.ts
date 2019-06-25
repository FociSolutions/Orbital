import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-scenario-overview',
  templateUrl: './scenario-overview.component.html',
  styleUrls: ['./scenario-overview.component.scss']
})
export class ScenarioOverviewComponent implements OnInit {
  // The following is just a placeholder, please replace with service
  @Output() addNewClicked: EventEmitter<boolean>;

  constructor() {
    this.addNewClicked = new EventEmitter();
  }

  ngOnInit() {}

  /**
   * The following is just a placeholder, please replace with service
   */
  OnAddNewClicked() {
    this.addNewClicked.emit(true);
  }
}
