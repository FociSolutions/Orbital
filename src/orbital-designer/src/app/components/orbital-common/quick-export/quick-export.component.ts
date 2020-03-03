import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-quick-export',
  templateUrl: './quick-export.component.html',
  styleUrls: ['./quick-export.component.scss']
})
export class QuickExportComponent implements OnInit {
  triggerOpenCancelBox: boolean;
  urlToNavigatTo: string;

  constructor(private router: Router) {}

  /**
   * opens dialog to dismiss current scenario to review
   *
   */
  openCancelDialogOrNavigateToUrl(url: string) {
    if (this.router.url.includes('scenario-editor')) {
      this.urlToNavigatTo = url;
      this.triggerOpenCancelBox = true;
    } else {
      this.router.navigate([url]);
    }
  }

  selected() {
    this.router.navigateByUrl('export-to-server');
  }

  ngOnInit() {}
}
