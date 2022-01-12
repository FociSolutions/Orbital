import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { ExportMockdefinitionService } from '../../../services/export-mockdefinition/export-mockdefinition.service';
import { MockDefinition } from '../../../models/mock-definition/mock-definition.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-quick-export',
  templateUrl: './quick-export.component.html',
  styleUrls: ['./quick-export.component.scss'],
})
export class QuickExportComponent {
  triggerOpenCancelBox: boolean;
  urlToNavigateTo: string;
  urlInService: string;
  mockInService: MockDefinition;
  exportStatusMessage: string;
  exportErrorMessage: string;

  constructor(
    private router: Router,
    private mockdefinitionService: ExportMockdefinitionService,
    private logger: NGXLogger
  ) {}

  /**
   * opens dialog to dismiss current scenario to review
   * Redirects to Export to Server page unless server url
   * and mockdefinition are cached in service, then do
   * a quick export.
   *
   */
  openCancelDialogOrNavigateToUrl(url: string) {
    this.urlInService = this.mockdefinitionService.getUrl();
    this.mockInService = this.mockdefinitionService.getMockdefinition();
    if (this.router.url.includes('scenario-editor')) {
      this.triggerOpenCancelBox = true;
    } else if (this.urlInService) {
      this.exportStatusMessage = '';
      this.exportErrorMessage = '';
      this.mockdefinitionService.exportMockDefinition(this.urlInService, this.mockInService).subscribe(
        (gotExported) => {
          if (gotExported) {
            this.logger.debug('Mockdefinition has been exported: ', this.mockInService);
            this.logger.debug('To Url: ', this.urlInService);
            this.exportStatusMessage = `File successfully exported to ${this.urlInService}`;
            this.urlToNavigateTo = url;
          } else {
            this.exportErrorMessage = 'File could not be exported because of an error';
            this.router.navigate([url]);
          }
        },
        () => {
          this.exportErrorMessage = 'File could not be exported because of an error';
          this.router.navigate([url]);
        }
      );
    } else {
      this.exportErrorMessage = 'File could not be exported because of an error';
      this.router.navigate([url]);
    }
  }
}
