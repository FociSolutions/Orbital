import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { openApiFileValidator } from '../../../../src/app/validators/async/async-file-content-validator';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { FileParserService } from 'src/app/services/file-parser.service';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';

@Component({
  selector: 'app-import-from-file',
  templateUrl: './import-from-file.component.html',
  styleUrls: ['./import-from-file.component.scss']
})
export class ImportFromFileComponent implements OnInit {
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
      openApiFile: new FormControl(
        null,
        Validators.required,
        openApiFileValidator
      )
    });
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
      console.log(mockDefinition);
      this.router.navigateByUrl('mock-editor');
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

    console.log(this.formGroup.controls.openApiFile.value);
    return ((await this.fileParser.readOpenApiSpec(this.formGroup.controls
      .openApiFile.value as File)) as unknown) as MockDefinition;
  }

  ngOnInit() {}
}
