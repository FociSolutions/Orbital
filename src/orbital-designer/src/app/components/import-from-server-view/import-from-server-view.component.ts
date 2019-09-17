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
  readonly getAllEndpoint = '/api/v1/OrbitalAdmin';
  control: FormControl;
  constructor(private location: Location) {
    this.control = new FormControl(
      [],
      Validators.compose([Validators.required])
    );
  }

  ngOnInit() {}

  /**
   * Getter function that returns true if the form is invalid, false otherwise
   */
  get disabled(): boolean {
    return this.control.invalid;
  }

  /**
   * If the response returned is a status 200 it sets the control value to the
   * response body. The control is then responsible for validation.
   * @param response HttpResponse received by the RestRequestInput
   */
  onResponse(response: HttpResponse<unknown>) {
    if (response.status === 200) {
      this.control.setValue(response.body);
    }
    console.log(this.control.value);
  }

  /**
   * Returns to the previous location
   */
  onBack() {
    this.location.back();
  }
}
