import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormControl,
  FormArray,
  ValidationErrors,
  AbstractControl
} from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { mockDefinitionObjectValidatorFactory } from 'src/app/validators/mock-definition-object-validator/mock-definition-object-validator';
import { MockDefinition } from 'src/app/models/mock-definition/mock-definition.model';
import { DesignerStore } from 'src/app/store/designer-store';
import { Router } from '@angular/router';
import Json from '../../models/json';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  readonly emptyListMessageServerBox = 'No MockDefinitions';
  readonly invalidMockDefinitionsFoundErrorMessage =
    'One or more invalid Mock Definitions found';
  mockDefinitions: MockDefinition[] = [];
  formArray: FormArray;

  controlsMockDefinitionToString = (control: AbstractControl) =>
    (control.value as MockDefinition).metadata.title

  constructor(
    private location: Location,
    private logger: NGXLogger,
    private designerStore: DesignerStore,
    private router: Router
  ) {
    this.formArray = new FormArray([]);
  }

  ngOnInit() { }

  /**
   * The function called on submit. Sets the mockDefinitions in the DesignerStore
   */
  onSubmit() {
    this.designerStore.mockDefinitions = this.mockDefinitions.map(
      mockDefinition => this.scenarioObjectsToMap(mockDefinition)
    );
    this.router.navigateByUrl('endpoint-view');
  }

  /**
   * Sets the mockDefinitions property equal to the list of MockDefinitions derived from the
   * FormControl values.
   * @param list The list of FormControls given by the shuttle list when the user moves items from
   * one list to the other.
   */
  onListOutput(list: FormControl[]) {
    this.mockDefinitions = list.map(control => control.value);
  }

  /**
   * Getter function that returns true if no Mock Definitions have been selected for
   */
  get disabled(): boolean {
    return this.mockDefinitions.length === 0;
  }

  /**
   * Getter function that returns the formArrays validation errors
   */
  get errors(): ValidationErrors | null {
    if (this.formArray.invalid && this.formArray.errors === null) {
      this.formArray.setErrors({
        invalidMockDefinitionFound: this.invalidMockDefinitionsFoundErrorMessage
      });
      this.logger.debug(
        'ImportFromServerViewComponent invalidMockDefinitions in formArray',
        this.formArray
      );
    }
    return this.formArray.errors;
  }

  /**
   * If the response returned is not an error or domexceptions it sets the controls
   * values to the response body. The control is then responsible for validation.
   * @param response HttpResponse received by the RestRequestInput
   */
  onResponse(
    response: HttpResponse<unknown> | HttpErrorResponse | DOMException
  ) {
    this.logger.debug('Received http response', response);
    if (response instanceof HttpResponse && Array.isArray(response.body)) {
      this.formArray = new FormArray(
        response.body.map(
          obj =>
            new FormControl(obj, null, [
              mockDefinitionObjectValidatorFactory(this.logger)
            ])
        )
      );
      this.logger.debug(
        'ImportFormServerViewComponent FormArray value:',
        this.formArray
      );
    } else if (
      response instanceof HttpErrorResponse ||
      response instanceof DOMException
    ) {
      this.formArray.setErrors({
        responseError: 'Response returned an error'
      });
      this.logger.debug(
        'ImportFromServerViewComponent formArray.errors: ',
        this.formArray.errors
      );
    } else {
      this.formArray.setErrors({
        contentError: 'Expected response body to be an array'
      });
      this.logger.debug(
        'ImportFromServerViewComponent formArray.errors: ',
        this.formArray.errors
      );
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }

  /**
   * Converts scenario header and query properties into es6 Maps. Returns the modified MockDefintion
   * @param mockDefinition The mockDefinition to modify
   */
  private scenarioObjectsToMap(mockDefinition: MockDefinition): MockDefinition {
    return {
      ...mockDefinition,
      scenarios: mockDefinition.scenarios.map(s => ({
        ...s,
        response: {
          ...s.response,
          headers: Json.objectToMap(s.response.headers)
        },
        requestMatchRules: {
          headerRules: Json.objectToMap(s.requestMatchRules.headerRules),
          queryRules: Json.objectToMap(s.requestMatchRules.queryRules),
          bodyRules: s.requestMatchRules.bodyRules
        }
      }))
    };
  }
}
