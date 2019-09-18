import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { mockFileValidator } from '../../validators/mock-file-validator/mock-file-validator';
import { FileParserService } from '../../services/file-parser.service';
import { DesignerStore } from '../../store/designer-store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';

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
  fileParser: FileParserService;
  constructor(
    router: Router,
    location: Location,
    fileParser: FileParserService,
    store: DesignerStore
  ) {
    this.router = router;
    this.location = location;
    this.fileParser = fileParser;
    this.store = store;
    this.formGroup = new FormGroup({
      mockDefinitionFile: new FormControl(
        null,
        Validators.required,
        mockFileValidator
      )
    });
  }

  isValid() {
    return this.errorMessages('mockDefinitionFile').length !== 0;
  }

  /**
   * Function used to get the appropriate error messages to display for the form control
   * @param controlkey The key of the control to get the errors from
   */
  errorMessages(controlkey: string): string[] {
    const errors = this.formGroup.controls[controlkey].errors;
    if (!errors) {
      return [];
    }

    const defaultErrorMappings = {
      required: `${controlkey} is required`,
      maxlength: 'Max characters exceeded'
    };

    const errorMessages = Object.keys(errors).map(err =>
      !!defaultErrorMappings[err] ? defaultErrorMappings[err] : errors[err]
    );

    return errorMessages;
  }

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
  async createMock() {
    const mockDefinition = await this.formToMockDefinition();
    if (!!mockDefinition) {
      this.store.mockDefinition = mockDefinition;
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

    return await this.fileParser.readMockDefinition(this.formGroup.controls
      .mockDefinitionFile.value as File);
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  ngOnInit() {}
}
