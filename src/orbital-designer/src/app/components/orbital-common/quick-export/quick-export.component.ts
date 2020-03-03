import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-export',
  templateUrl: './quick-export.component.html',
  styleUrls: ['./quick-export.component.scss']
})
export class QuickExportComponent implements OnInit {
  triggerOpenCancelBox: boolean;
  urlToNavigateTo: string;

  constructor(private router: Router) {}

  /**
   * opens dialog to dismiss current scenario to review
   *
   */
  openCancelDialogOrNavigateToUrl(url: string) {
    if (this.router.url.includes('scenario-editor')) {
      this.urlToNavigateTo = url;
      this.triggerOpenCancelBox = true;
    } else {
      this.router.navigate([url]);
    }
  }

  ngOnInit() {}
}
