import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
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
export class CreateNewMockViewComponent {
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
      title: new FormControl('', this.validateText("Title")),
      description: new FormControl(''),
      validateToken: new FormControl(false),
      key: new FormControl('', this.validateText("Key"))
    });
    this.checkTokenValidation();

    this.formGroup.get('validateToken').valueChanges.subscribe( () => {
      this.checkTokenValidation();
    })
  }

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

  get validateToken() {
    return this.formGroup.get('validateToken');
  }

  /**
   * Validation for text inputs on this page.
   * @param name - the form control name
   * @returns null, or an error object.
   */
  validateText(name: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value.length > 0 && control.value.trim().length === 0) {
        return { key: name + ' cannot contain only whitespace' };
      }
      if (control.value.length <= 0) {
        return { key: name + ' is required.' };
      }
      if (name == "Key") {
        //Checks for whitespace within the string
        return /\s/.test(control.value) ? { 'key': "Key cannot contain whitespace." } : null;
      }
    }
  }

  /**
   * sets key for control as disabled if token validation is unchecked
   */
  checkTokenValidation() {
    const tokenValidation = this.formGroup.controls.validateToken.value;
    const formKey = this.formGroup.controls.key
    if (!tokenValidation) {
      formKey.disable();
    }
    else {
      formKey.enable();
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
          tokenValidation: {
            validate: this.formGroup.value.validateToken,
            key: this.formGroup.value.key
          },
          openApi: openapi,
          scenarios: defaultScenariosPerEndpoint
        } as MockDefinition;
      })
    );
    return obser;
  }
}
