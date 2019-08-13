import { Component, OnInit } from '@angular/core';
import { FileParserService } from 'src/app/services/file-parser.service';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { Router } from '@angular/router';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { EndpointsStore } from 'src/app/store/endpoints-store';

@Component({
  selector: 'app-import-existing-mock',
  templateUrl: './import-existing-mock.component.html',
  styleUrls: ['./import-existing-mock.component.scss']
})
export class ImportExistingMockComponent implements OnInit {
  fileName = 'Import Existing Mock Definition';
  showError = false;

  constructor(
    private fileParser: FileParserService,
    private mockDefinitionStore: MockDefinitionStore,
    private endpointsStore: EndpointsStore,
    private router: Router
  ) {}

  ngOnInit() {}

  /**
   * Handles on change event for the file input
   * @param files Mock definition file selected
   */
  async onFileInput(files: FileList) {
    const file = files[0];
    try {
      const mockDefinition = await this.fileParser.readMockDefinition(file);
      this.mockDefinitionStore.setState(mockDefinition);
      this.endpointsStore.setEndpoints(mockDefinition.openApi);
      this.router.navigate(['/EndpointOverview']);
      this.showError = false;
    } catch (err) {
      window.alert(
        'The file provided has empty data. Please try again with a valid one.'
      );
      this.showError = true;
    }
    this.fileName = file.name;
  }
}
