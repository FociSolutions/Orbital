import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';
import { openApiFileValidator } from '../../../../src/app/validators/async/async-file-content-validator';

@Component({
  selector: 'app-import-from-file',
  templateUrl: './import-from-file.component.html',
  styleUrls: ['./import-from-file.component.scss']
})
export class ImportFromFileComponent implements OnInit {
  formGroup: FormGroup;
  constructor() {
    this.formGroup = new FormGroup({
      openApiFile: new FormControl(
        null,
        Validators.required,
        openApiFileValidator
      )
    });
  }

  /**
   * Function used to get the appropriate error messages to display for the form control
   * @param controlkey The key of the control to get the errors from
   */
  errorMessages(controlkey: string): string[] {
    const errors = this.formGroup.controls[controlkey].errors;
    if (!errors) {
      return [];
    }

    const defaultErrorMappings = {
      required: `${controlkey} is required`,
      maxlength: 'Max characters exceeded'
    };

    const errorMessages = Object.keys(errors).map(err =>
      !!defaultErrorMappings[err] ? defaultErrorMappings[err] : errors[err]
    );

    return errorMessages;
  }

  ngOnInit() {}
}
