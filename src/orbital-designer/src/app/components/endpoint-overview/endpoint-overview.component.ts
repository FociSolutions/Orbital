import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-endpoint-overview',
  templateUrl: './endpoint-overview.component.html',
  styleUrls: ['./endpoint-overview.component.scss']
})
export class EndpointOverviewComponent implements OnInit {
  // This is just a placeholder to show component toggle
  shouldShowOverview = true;

  constructor() {}

  ngOnInit() {}

  /**
   * Handle onCLick event for export mock file button
   */
  onExportClicked() {}

  /**
   * This is just a placeholder to show component toggle
   */
  onAddNewClicked() {
    this.shouldShowOverview = false;
  }
}
