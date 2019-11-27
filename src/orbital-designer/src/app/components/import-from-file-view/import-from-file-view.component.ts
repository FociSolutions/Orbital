import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { mockFileValidator } from '../../validators/mock-file-validator/mock-file-validator';
import { FileParserService } from '../../services/file-parser/file-parser.service';
import { DesignerStore } from '../../store/designer-store';
import { Router } from '@angular/router';
import { Location } from '@angular/common';
import { MockDefinition } from '../../models/mock-definition/mock-definition.model';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { NGXLogger } from 'ngx-logger';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';

@Component({
  selector: 'app-import-from-file-view',
  templateUrl: './import-from-file-view.component.html',
  styleUrls: ['./import-from-file-view.component.scss']
})
export class ImportFromFileViewComponent implements OnInit {
  formGroup: FormGroup;
  private router: Router;
  private location: Location;
  mockDefinitionService: MockDefinitionService;
  constructor(
    router: Router,
    location: Location,
    mockDefinitionService: MockDefinitionService,
    logger: NGXLogger
  ) {
    this.router = router;
    this.location = location;
    this.mockDefinitionService = mockDefinitionService;
    this.formGroup = new FormGroup({
      mockDefinitionFile: new FormControl(
        null,
        extendBuiltInValidatorFactory(Validators.required, logger),
        mockFileValidator(mockDefinitionService)
      )
    });
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
    const mockDefinition = this.mockDefinitionService.deserialize(this.formGroup.controls
      .mockDefinitionFile.value as string);
    if (mockDefinition) {
      this.router.navigateByUrl('endpoint-view');
    }
  }

  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  ngOnInit() {}
}
