import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, AbstractControl, ValidatorFn } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { NGXLogger } from 'ngx-logger';
import { OpenApiSpecService } from 'src/app/services/openapispecservice/open-api-spec.service';
import { Observable, EMPTY } from 'rxjs';
import { map } from 'rxjs/operators';
import { MockDefinitionService } from 'src/app/services/mock-definition/mock-definition.service';
import { recordAdd, recordMap } from 'src/app/models/record';
import * as uuid from 'uuid';

@Component({
  selector: 'app-create-edit-mock-view',
  templateUrl: './create-edit-mock-view.component.html',
  styleUrls: ['./create-edit-mock-view.component.scss']
})
export class CreateEditMockViewComponent implements OnInit {
  formGroup: FormGroup;
  private openApiFile: string;
  private mockDefinitions: MockDefinition[] = [];
  private mockId: string;
  private keyStore: string;

  public editMode: boolean;
  public titleList: string[] = [];
  public selectedMockDefinition: MockDefinition;

  //Data variables for edit mode
  public mockTitle: string;
  public mockDesc: string;
  public mockTokenValid: boolean;
  public mockKey: string;

  errorMessageToEmitFromCreate = {} as Record<string, string[]>;
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

  ngOnInit() {
    this.mockId = this.route.snapshot.paramMap.get('uuid');
    this.editMode = !!this.mockId;

    this.store.state$.subscribe(state => {
      if (!!state.mockDefinition) {
        this.mockDefinitions = recordMap(state.mockDefinitions, md => md);
      }
    });
    if (this.editMode) {
      this.selectedMockDefinition = this.findSelectedMock(this.mockId, this.mockDefinitions);
      if (this.selectedMockDefinition == null) {
        this.router.navigateByUrl('/endpoint-view');
      }
    }
    else {
      if (this.mockDefinitions.length != 0) {
        for (let key in this.mockDefinitions) {
          this.titleList.push(this.mockDefinitions[key].metadata.title);
        }
      }
    }
  }

  /**
   * Finds mock selected on sidebar and populated the form data
   */
  findSelectedMock(mockId: string, mockDefinitions: MockDefinition[]): MockDefinition {
    let foundMock: MockDefinition;
    for (let key in mockDefinitions) {
      if (mockDefinitions[key].id == mockId) {
        foundMock = mockDefinitions[key];
      }
      else {
        this.titleList.push(mockDefinitions[key].metadata.title);
      }
    }
    if (foundMock != null || undefined) {
      if (foundMock.tokenValidation == null || undefined) {
        foundMock.tokenValidation = {
          validate: false,
          key: ""
        }
      }
      this.populateEditData(foundMock);
      return foundMock;
    }
    return null
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

  editMock() {
    let updatedMockDef = this.formToUpdateMockDefinition(this.selectedMockDefinition);
    const oldTitle = this.selectedMockDefinition.metadata.title;

    if (updatedMockDef.tokenValidation.validate) {
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
    return (control: AbstractControl): { [key: string]: any } | null => {
      if (control.value != null || undefined) {
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
        if (name == "Title") {
          //checks if the current title already exist
          for (let i = 0; i < this.titleList.length; i++) {
            if (control.value == this.titleList[i]) {
              return { key: name + " already exists."}
            }
          }
        }
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
      this.keyStore = formKey.value;
      formKey.clearValidators();
      formKey.updateValueAndValidity();
    }
    else {
      formKey.setValidators(this.validateText("Key"));
      formKey.updateValueAndValidity();
      formKey.markAsDirty();
    }
  }

  populateEditData(md: MockDefinition) {
    this.formGroup.get('title').setValue(md.metadata.title);
    this.formGroup.get('description').setValue(md.metadata.description);
    this.formGroup.get('validateToken').setValue(md.tokenValidation.validate);
    this.formGroup.get('key').setValue(md.tokenValidation.key);
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
    const validate = this.formGroup.value.validateToken;
    const obser = this.openapiservice.readOpenApiSpec(this.openApiFile).pipe(
      map(openapi => {
        const defaultScenariosPerEndpoint = this.mockdefinitionService.getDefaultScenarios(openapi.paths, validate);
        return {
          id: uuid.v4(),
          metadata: {
            title: this.formGroup.value.title,
            description: this.formGroup.value.description
          },
          tokenValidation: {
            validate,
            key: this.formGroup.value.key
          },
          openApi: openapi,
          scenarios: defaultScenariosPerEndpoint
        } as MockDefinition;
      })
    );
    return obser;
  }

  formToUpdateMockDefinition(oldMockDef: MockDefinition): MockDefinition {
    let newMockDef: MockDefinition = JSON.parse(JSON.stringify(oldMockDef));
    newMockDef.metadata = {
      title: this.formGroup.value.title,
      description: this.formGroup.value.description
    }
    newMockDef.tokenValidation = {
      validate: this.formGroup.value.validateToken,
      key: this.formGroup.value.key == undefined ? this.keyStore: this.formGroup.value.key
    }
    return newMockDef;
  }
}


