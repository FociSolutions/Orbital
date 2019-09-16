import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { openApiFileValidator } from 'src/app/validators/open-api-file-validator/open-api-file-validator';
import { FileParserService } from 'src/app/services/file-parser.service';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';

@Component({
  selector: 'app-create-new-mock-view',
  templateUrl: './create-new-mock-view.component.html',
  styleUrls: ['./create-new-mock-view.component.scss']
})
export class CreateNewMockViewComponent implements OnInit {
  formGroup: FormGroup;
  constructor(
    private router: Router,
    private location: Location,
    private fileParser: FileParserService,
    private store: DesignerStore
  ) {
    this.formGroup = new FormGroup({
      title: new FormControl(
        '',
        Validators.compose([Validators.maxLength(200), Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.maxLength(1000)])
      ),
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

  ngOnInit() {}

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
  async createMock() {
    const mockDefinition = await this.formToMockDefinition();
    if (!!mockDefinition) {
      this.store.mockDefinition = mockDefinition;
      this.router.navigateByUrl('mock-editor');
    }
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
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
    const openApi = await this.fileParser.readOpenApiSpec(
      this.formGroup.value.openApiFile
    );
    return {
      metadata: {
        title: this.formGroup.value.title,
        description: this.formGroup.value.description
      },
      openApi,
      host: openApi.host,
      basePath: openApi.basePath,
      scenarios: []
    } as MockDefinition;
  }
}
