import { Component, OnInit, Input } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
      openApiFile: new FormControl(null, Validators.required)
    });
  }

  errorMessage(controlkey: string): string {
    let errorMessage = '';
    const errors = this.formGroup.controls[controlkey].errors;
    if (!errors) {
      return errorMessage;
    }
    for (const error of Object.keys(errors)) {
      switch (error) {
        case 'required':
          errorMessage = errorMessage.concat(`${controlkey} is required\n`);
          break;
        case 'maxlength':
          errorMessage = errorMessage.concat('Max characters exceeded\n');
          break;
        default:
          errorMessage = errorMessage.concat('Invalid input\n');
          break;
      }
    }
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
