import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { AbstractControl, FormControl, FormGroup, ValidationErrors, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { EMPTY, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { recordMap } from 'src/app/models/record';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-edit-mock-view',
  templateUrl: './create-edit-mock-view.component.html',
  styleUrls: ['./create-edit-mock-view.component.scss'],
})
export class CreateEditMockViewComponent implements OnInit {
  formGroup: FormGroup;
  private openApiFile: string;
  private mockDefinitions: MockDefinition[] = [];
  private mockId: string | null;
  private keyStore: string;

  editMode: boolean;
  titleList: string[] = [];
  selectedMockDefinition: MockDefinition;

  //Data variables for edit mode
  mockTitle: string;
  mockDesc: string;
  mockTokenValid: boolean;
  mockKey: string;

  errorMessageToEmitFromCreate: Record<string, string[]> = {};
  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private location: Location,
    private openapiservice: OpenApiSpecService,
    private mockdefinitionService: MockDefinitionService,
    private store: DesignerStore,
    private logger: NGXLogger
  ) {
    this.formGroup = new FormGroup({
      title: new FormControl('', this.validateText('Title')),
      description: new FormControl(''),
      validateToken: new FormControl(false),
    });
  }

  ngOnInit() {
    this.mockId = this.route.snapshot.paramMap.get('uuid');
    this.editMode = !!this.mockId;

    this.store.state$.subscribe((state) => {
      if (state.mockDefinition) {
        this.mockDefinitions = recordMap(state.mockDefinitions, (md) => md);
      }
    });
    if (this.editMode) {
      const maybeMockDef = this.findSelectedMock(this.mockId ?? '', this.mockDefinitions);
      if (!maybeMockDef) {
        this.router.navigateByUrl('/endpoint-view');
      } else {
        this.selectedMockDefinition = maybeMockDef;
      }
    } else if (this.mockDefinitions.length) {
      for (const mockDef of this.mockDefinitions) {
        this.titleList.push(mockDef.metadata.title);
      }
    }
  }

  /**
   * Finds mock selected on sidebar and populated the form data
   */
  findSelectedMock(mockId: string, mockDefinitions: MockDefinition[]): MockDefinition | null {
    let foundMock: MockDefinition | null = null;
    for (const mockDef of mockDefinitions) {
      if (mockDef.id === mockId) {
        foundMock = mockDef;
      } else {
        this.titleList.push(mockDef.metadata.title);
      }
    }
    if (foundMock) {
      foundMock.tokenValidation = !foundMock.tokenValidation ? false : true;
      this.populateEditData(foundMock);
      return foundMock;
    }
    return null;
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
      (value) => {
        if (value) {
          this.logger.debug('MockDefinition created from form ', value);
          this.store.appendMockDefinition(value);
          this.store.mockDefinition = value;
          this.router.navigateByUrl('/endpoint-view');
        } else {
          this.logger.log(value);
        }
      },
      (error) => {
        this.logger.error('openapi file provided is invalid');
        this.logger.error(error);
        this.errorMessageToEmitFromCreate['The provided OpenApi file has the following errors '] = error;
      }
    );
  }

  editMock() {
    const updatedMockDef = this.formToUpdateMockDefinition(this.selectedMockDefinition);
    const oldTitle = this.selectedMockDefinition.metadata.title;

    if (updatedMockDef.tokenValidation) {
      const validationScenarios = this.mockdefinitionService.getDefaultValidationScenarios(updatedMockDef.scenarios);
      updatedMockDef.scenarios = updatedMockDef.scenarios.concat(validationScenarios);
    }

    this.store.deleteMockDefinitionByTitle(oldTitle);
    this.store.appendMockDefinition(updatedMockDef);
    this.store.mockDefinition = updatedMockDef;
    this.router.navigateByUrl('/endpoint-view');
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
    return (control: AbstractControl): ValidationErrors | null => {
      if (control.value !== null && control.value !== undefined) {
        if (!control.value.length) {
          return { key: `${name} is required.` };
        }
        if (!control.value.trim().length) {
          return { key: `${name} cannot contain only whitespace` };
        }
        if (name === 'Title') {
          //checks if the current title already exist
          for (const title of this.titleList) {
            if (control.value === title) {
              return { key: `${name} already exists.` };
            }
          }
        }
      }
      return null;
    };
  }

  populateEditData(md: MockDefinition) {
    this.formGroup.get('title')?.setValue(md.metadata.title);
    this.formGroup.get('description')?.setValue(md.metadata.description);
    this.formGroup.get('validateToken')?.setValue(md.tokenValidation);
  }

  /**
   * formToMockDefinition method is responsible for creating a new MockDefinition from the
   * form values. If the form is invalid then the function will return null, otherwise it uses
   * the form values to create and return a new MockDefinition
   */
  formToMockDefinition(): Observable<MockDefinition | never> {
    if (this.formGroup.invalid) {
      this.logger.error('Form is invalid');
      return EMPTY;
    }
    const validate = this.formGroup.value.validateToken;
    const observable = this.openapiservice.readOpenApiSpec(this.openApiFile).pipe(
      map((openapi) => {
        const defaultScenariosPerEndpoint = this.mockdefinitionService.getDefaultScenarios(openapi.paths, validate);
        return {
          id: uuid.v4(),
          metadata: {
            title: this.formGroup.value.title,
            description: this.formGroup.value.description,
          },
          tokenValidation: validate,
          openApi: openapi,
          scenarios: defaultScenariosPerEndpoint,
        };
      })
    );
    return observable;
  }

  formToUpdateMockDefinition(oldMockDef: MockDefinition): MockDefinition {
    const newMockDef: MockDefinition = JSON.parse(JSON.stringify(oldMockDef));
    newMockDef.metadata = {
      title: this.formGroup.value.title,
      description: this.formGroup.value.description,
    };
    newMockDef.tokenValidation = this.formGroup.value.validateToken;
    return newMockDef;
  }
}
