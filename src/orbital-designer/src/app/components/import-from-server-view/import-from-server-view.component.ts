import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import {
  FormControl,
  Validators,
  FormGroup,
  FormArray,
  ValidatorFn
} from '@angular/forms';
import { HttpResponse, HttpErrorResponse } from '@angular/common/http';
import { NGXLogger } from 'ngx-logger';
import { mockDefinitionObjectValidatorFactory } from 'src/app/validators/mock-definition-object-validator/mock-definition-object-validator';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  readonly getAllEndpoint = '/api/v1/OrbitalAdmin';
  formArray: FormArray;
  constructor(private location: Location, private logger: NGXLogger) {
    this.formArray = new FormArray([], Validators.required);
    this.formArray.valueChanges.subscribe(value =>
      logger.debug('ImportFromServerViewComponent formArray value:', value)
    );
  }

  ngOnInit() {}

  /**
   * Getter function that returns true if the form is invalid, false otherwise
   */
  get disabled(): boolean {
    return this.formArray.invalid;
  }

  /**
   * If the response returned is a status 200 it sets the control value to the
   * response body. The control is then responsible for validation.
   * @param response HttpResponse received by the RestRequestInput
   */
  onResponse(response: HttpResponse<unknown> | HttpErrorResponse) {
    this.logger.debug('Received http response', response);
    if (response.ok && Array.isArray(response.body)) {
      this.formArray.controls = response.body.map(
        () =>
          new FormControl(null, null, [
            mockDefinitionObjectValidatorFactory(this.logger)
          ])
      );
      this.formArray.setValue(response.body);
    } else if (!response.ok) {
      this.formArray.setErrors({
        statusError: `Error ${response.status}: ${response.statusText}`
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
