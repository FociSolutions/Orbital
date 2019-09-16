import { Component, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { FormControl, Validators } from '@angular/forms';
import { HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-import-from-server-view',
  templateUrl: './import-from-server-view.component.html',
  styleUrls: ['./import-from-server-view.component.scss']
})
export class ImportFromServerViewComponent implements OnInit {
  getAllEndpoint = '/api/v1/OrbitalAdmin';
  control: FormControl;
  constructor(private location: Location) {
    this.control = new FormControl(
      [],
      Validators.compose([Validators.required])
    );
  }

  ngOnInit() {}

  importMock() {}

  get disabled(): boolean {
    return this.control.invalid;
  }

  onResponse(response: HttpResponse<unknown>) {
    if (response.status === 200) {
      this.control.setValue(response.body);
    }
    console.log(this.control.value);
  }

  onBack() {
    this.location.back();
  }
}
