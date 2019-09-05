import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { openApiFileValidator } from 'src/app/validators/async/async-file-content-validator';

@Component({
  selector: 'app-create-new-mock-view',
  templateUrl: './create-new-mock-view.component.html',
  styleUrls: ['./create-new-mock-view.component.scss']
})
export class CreateNewMockViewComponent implements OnInit {
  formGroup: FormGroup;
  constructor(private router: Router, private location: Location) {
    this.formGroup = new FormGroup({
      title: new FormControl(
        '',
        Validators.compose([Validators.maxLength(200), Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.maxLength(1000)])
      ),
      openApiFile: new FormControl(
        '',
        Validators.required,
        openApiFileValidator
      )
    });
  }

  /**
   * Function used to get the appropriate error message to display for the form control
   * @param controlkey The key of the control to get the errors from
   */
  errorMessage(controlkey: string): string {
    const errors = this.formGroup.controls[controlkey].errors;
    if (!errors) {
      return '';
    }

    const errorMessages = {
      required: `${controlkey} is required`,
      maxlength: 'Max characters exceeded'
    };

    const errorMessage = Object.keys(errors)
      .map(err => (!!errorMessages[err] ? errorMessages[err] : errors[err]))
      .join('\n');

    return errorMessage.trim();
  }

  ngOnInit() {}

  createMock() {
    this.router.navigateByUrl('mock-editor');
  }

  goBack() {
    this.location.back();
  }
}
