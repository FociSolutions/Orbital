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

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  readonly getAllEndpoint = '/api/v1/OrbitalAdmin';
  formArray: FormArray;
  emptyListMessageServerBox = 'No Valid MockDefinitions Found';
  mockDefinitions: MockDefinition[] = [];
  controlsMockDefinitionToString = (control: AbstractControl) =>
    (control.value as MockDefinition).metadata.title

  constructor(private location: Location, private logger: NGXLogger) {
    this.formArray = new FormArray([]);
    this.formArray.valueChanges.subscribe(value =>
      logger.debug('ImportFromServerViewComponent formArray value:', value)
    );
  }

  ngOnInit() {}

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
      this.formArray.controls = response.body.map(
        () =>
          new FormControl(null, null, [
            mockDefinitionObjectValidatorFactory(this.logger)
          ])
      );
      this.formArray.setValue(response.body);
    } else if (
      response instanceof HttpErrorResponse ||
      response instanceof DOMException
    ) {
      this.formArray.setErrors({
        responseError: 'Response returned an error'
      });
    } else {
      this.formArray.setErrors({
        contentError: 'Expected response body to be an array'
      });
    }
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }
}
