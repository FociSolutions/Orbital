import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, AbstractControl } from '@angular/forms';
import { Router } from '@angular/router';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { recordAdd } from 'src/app/models/record';

@Component({
  selector: 'app-create-new-mock-view',
  templateUrl: './create-new-mock-view.component.html',
  styleUrls: ['./create-new-mock-view.component.scss']
})
export class CreateNewMockViewComponent implements OnInit {
  formGroup: FormGroup;
  private openApiFile: string;
  errorMessageToEmitFromCreate = {} as Record<string, string[]>;
  constructor(
    private router: Router,
    private location: Location,
    private openapiservice: OpenApiSpecService,
    private mockdefinitionService: MockDefinitionService,
    private store: DesignerStore,
    private logger: NGXLogger
  ) {
    this.formGroup = new FormGroup({
      title: new FormControl('', this.validateTitle),
      description: new FormControl('')
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
    observable.subscribe(
      value => {
        if (!!value) {
          this.logger.debug('MockDefinition created from form ', value);
          this.store.appendMockDefinition(value);
          this.store.mockDefinition = value;
          this.router.navigateByUrl('/endpoint-view');
        } else {
          this.logger.log(value);
        }
      },
      error => {
        this.logger.error('openapi file provided is invalid');
        this.logger.error(error);
        this.errorMessageToEmitFromCreate = recordAdd(
          this.errorMessageToEmitFromCreate,
          'The provided OpenApi file has the following errors ',
          error
        );
      }
    );
  }

  setOpenApiFile(openApiFileString: string) {
    this.openApiFile = openApiFileString;
  }
  /**
   * Goes back to the previous location in the app
   */
  goBack() {
    this.location.back();
  }

  validateTitle(control: AbstractControl): { [key: string]: any } | null {
    if (control.value.length > 0 && control.value.trim().length === 0) {
      return { key: 'Title cannot contain only whitespace' };
    }
    if (control.value.length <= 0) {
      return { key: 'Must enter a title' };
    }
  }

  /**
   * formToMockDefinition method is responsible for creating a new MockDefinition from the
   * form values. If the form is invalid then the function will return null, otherwise it uses
   * the form values to create and return a new MockDefinition
   */
  formToMockDefinition(): Observable<MockDefinition> {
    if (this.formGroup.invalid) {
      this.logger.error('Form is invalid');
      return EMPTY;
    }

    const obser = this.openapiservice.readOpenApiSpec(this.openApiFile).pipe(
      map(openapi => {
        const defaultScenariosPerEndpoint = this.mockdefinitionService.getDefaultScenarios(openapi.paths);
        return {
          metadata: {
            title: this.formGroup.value.title,
            description: this.formGroup.value.description
          },
          openApi: openapi,
          scenarios: defaultScenariosPerEndpoint
        } as MockDefinition;
      })
    );
    return obser;
  }
}
