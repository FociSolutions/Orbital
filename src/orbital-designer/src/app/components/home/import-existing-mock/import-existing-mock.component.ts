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
      const doc = await MockDefinition.toOpenApiSpec(mockDefinition.openApi);
      this.mockDefinitionStore.setState(mockDefinition);
      this.endpointsStore.addEndpoints(doc);
      this.router.navigate(['/EndpointOverview']);
      this.showError = false;
    } catch (err) {
      this.showError = true;
    }
    this.fileName = file.name;
  }
}
