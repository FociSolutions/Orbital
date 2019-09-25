import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { openApiFileValidator } from 'src/app/validators/open-api-file-validator/open-api-file-validator';
import { FileParserService } from 'src/app/services/file-parser/file-parser.service';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { NGXLogger } from 'ngx-logger';

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
    private store: DesignerStore,
    private logger: NGXLogger
  ) {
    this.formGroup = new FormGroup({
      title: new FormControl(
        '',
        extendBuiltInValidatorFactory(
          Validators.compose([Validators.maxLength(200), Validators.required]),
          logger
        )
      ),
      description: new FormControl(
        '',
        extendBuiltInValidatorFactory(
          Validators.compose([Validators.maxLength(1000)]),
          logger
        )
      ),
      openApiFile: new FormControl(
        null,
        extendBuiltInValidatorFactory(Validators.required, logger),
        openApiFileValidator
      )
    });
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
      this.logger.debug('MockDefinition created from form ', mockDefinition);
      this.store.mockDefinitions = [mockDefinition];
      this.router.navigateByUrl('endpoint-view');
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
      this.logger.debug('Form is invalid');
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
