import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { extendBuiltInValidatorFactory } from 'src/app/validators/extend-built-in-validator-factory/extend-built-in-validator-factory';
import { NGXLogger } from 'ngx-logger';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { Observable, EMPTY } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { IfStmt } from '@angular/compiler';

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
    private openapiservice: OpenApiSpecService,
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
      )
    });
  }

  ngOnInit() {}

  /**
   * createMock is a function that is responsible for storing the new MockDefinition
   * in the designer store and navigating to the mock editor if the form is valid. If
   * the form is invalid the function does nothing.
   */
  createMock() {
    const observable = this.formToMockDefinition();

    if (observable === EMPTY) {
      this.logger.debug('Form is invalid');
      return;
    }
    observable.subscribe(mockDefinition => {
        if (!!mockDefinition) {
        this.logger.debug('MockDefinition created from form ', mockDefinition);
        console.log(mockDefinition);
        this.store.mockDefinitions = [mockDefinition];
        this.router.navigateByUrl('endpoint-view');
      }
    },
    err => console.log(err));

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
   formToMockDefinition(): Observable<MockDefinition> {
    if (this.formGroup.invalid) {
      this.logger.debug('Form is invalid');
      return EMPTY;
    }

    return this.openapiservice.readOpenApiSpec(this.formGroup.value.openApiFile).pipe(map(
      value => ({
        metadata: {
          title: this.formGroup.value.title,
          description: this.formGroup.value.description
        },
        openApi: value,
        scenarios: []
      } as MockDefinition)
      ));
  }
}
