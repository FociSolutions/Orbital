import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl } from '@angular/forms';
import { mockFileValidator } from '../../validators/mock-file-validator/mock-file-validator';
import { FileParserService } from '../../services/file-parser/file-parser.service';
import { DesignerStore } from '../../store/designer-store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-import-from-file-view',
  templateUrl: './import-from-file-view.component.html',
  styleUrls: ['./import-from-file-view.component.scss']
})
export class ImportFromFileViewComponent implements OnInit {
  formGroup: FormGroup;
  private store: DesignerStore;
  private router: Router;
  private location: Location;

  private mockDefinitionString: string;
  errorMessageToEmitFromCreate: string[];
  mockDefinitionNameString: string;
  validFileFlag = false;
  fileParser: FileParserService;
  constructor(
    router: Router,
    location: Location,
    fileParser: FileParserService,
    store: DesignerStore,
    logger: NGXLogger
  ) {
    this.router = router;
    this.location = location;
    this.fileParser = fileParser;
    this.store = store;
    this.formGroup = new FormGroup({
      mockDefinitionFile: new FormControl(
        null
      )
    });
    this.errorMessageToEmitFromCreate = ['The mockdefinition could not be uploaded because it is invalid'];
  }

  isValid() {
    return !this.formGroup.invalid;
  }

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
  async createMock() {
    const mockDefinition = await this.formToMockDefinition();
    if (!!mockDefinition) {
      this.store.mockDefinitions = [mockDefinition];
      this.router.navigateByUrl('endpoint-view');
    }
  }

  /**
   * formToMockDefinition method is responsible for creating a new MockDefinition from the
   * form values. If the form is invalid then the function will return null, otherwise it uses
   * the form values to create and return a new MockDefinition
   */
  async formToMockDefinition(): Promise<MockDefinition> {
    if (this.formGroup.invalid) {
      return null;
    }

    return await MockDefinition.toMockDefinitionAsync(this.mockDefinitionString);
  }

  /**
   * Sets the string represantation of the file's content from the input-file component.
   *
   * @param fileStringFromFileInput string representation of the file's content
   */
  setMockDefinition(fileStringFromFileInput: string) {
    this.mockDefinitionString = fileStringFromFileInput;

    this.validateMock(fileStringFromFileInput);
  }

  /**
   * Sets the file name in the component. This value is emited from the input-file component.
   *
   * @param fileStringName string representation of the file's name
   */
  setMockDefinitionName(fileStringName: string) {
    this.mockDefinitionNameString = fileStringName;
  }

  /**
   * Validates the Mockdefinition and returns a boolean validation status
   */
  async validateMock(mockDefinitionString: string) {
    MockDefinition.toMockDefinitionAsync(mockDefinitionString).then(
      () => this.validFileFlag = true,
      () => this.validFileFlag = false
    );
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  ngOnInit() {}
}
