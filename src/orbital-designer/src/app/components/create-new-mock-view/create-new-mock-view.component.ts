import { Component, OnInit, Input } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

@Component({
  selector: 'app-create-new-mock-view',
  templateUrl: './create-new-mock-view.component.html',
  styleUrls: ['./create-new-mock-view.component.scss']
})
export class CreateNewMockViewComponent implements OnInit {
  formGroup: FormGroup;
  errorMessages = {
    title: new Map<string, string>([
      ['required', 'title is required'],
      ['maxlength', 'Max characters exceeded']
    ]),
    description: new Map<string, string>([
      ['required', 'title is required'],
      ['maxlength', 'Max characters exceeded']
    ])
  };
  constructor() {
    this.formGroup = new FormGroup({
      title: new FormControl(
        '',
        Validators.compose([Validators.maxLength(200), Validators.required])
      ),
      description: new FormControl(
        '',
        Validators.compose([Validators.maxLength(1000)])
      )
    });
  }

  ngOnInit() {}
}
