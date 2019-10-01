import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MockDefinitionStore } from 'src/app/store/mockdefinitionstore';
import { FileParserService } from 'src/app/services/file-parser.service';
import { Metadata } from 'src/app/models/mock-definition/metadata.model';
import { EndpointsStore } from 'src/app/store/endpoints-store';

@Component({
  selector: 'app-new-mock-form',
  templateUrl: './new-mock-form.component.html',
  styleUrls: ['./new-mock-form.component.scss']
})
export class NewMockFormComponent implements OnInit {
  showError = false;
  fileName = '';
  metaData: Metadata = {
    title: '',
    description: ''
  };

  constructor(
    private mockDefinitionstore: MockDefinitionStore,
    private endpointStore: EndpointsStore,
    private fileParser: FileParserService,
    private router: Router
  ) {}

  ngOnInit() {}

  /**
   * Updates the MockDefinitionsStore's metadata description
   * @param title the new title string for the metadata
   */
  onMockNameChange(title: string) {
    this.metaData = {
      ...this.metaData,
      title
    };
  }

  /**
   * Updates the MockDefintionStore's metadata description
   * @param description the new description string for the metadata
   */
  onDescriptionChange(description: string) {
    this.metaData = {
      ...this.metaData,
      description
    };
  }

  /**
   * The function that is triggered when the New Mock Form is submitted
   */
  onFormSubmit() {
    this.mockDefinitionstore.updateScenarios([]);
    this.mockDefinitionstore.updateMetadata(this.metaData);
    this.router.navigate(['/EndpointOverview']);
  }

  /**
   * Receives a FileList object as input from the forms file input element, attempts to parse the file
   * received and update the MockDefinition Store with the Api Information. If the file is invalid
   * it sets the showError flag to true, displaying the error message for an invalid file. Otherwise sets
   * the flag to false, hiding the message if already displayed.
   * @param files an Object representing the files submitted with the onChange event from the file input
   */
  async onFileChange(files: FileList) {
    const file = files[0];
    try {
      const openApi = await this.fileParser.readOpenApiSpec(file);
      this.mockDefinitionstore.updateApiInformation(
        openApi.host,
        openApi.basePath,
        openApi
      );
      this.endpointStore.setEndpoints(openApi);
      this.showError = false;
    } catch (err) {
      this.showError = true;
    }
    this.fileName = file.name;
  }
}
