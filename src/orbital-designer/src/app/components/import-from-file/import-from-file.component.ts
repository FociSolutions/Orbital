import { Component, OnInit } from '@angular/core';
import { FormGroup, Validators, FormControl } from '@angular/forms';

@Component({
  selector: 'app-import-from-file',
  templateUrl: './import-from-file.component.html',
  styleUrls: ['./import-from-file.component.scss']
})
export class ImportFromFileComponent implements OnInit {
  formGroup: FormGroup;
  constructor() {
    this.formGroup = new FormGroup({
      openApiFile: new FormControl(null, Validators.required)
    });
  }

  ngOnInit() {}
}
