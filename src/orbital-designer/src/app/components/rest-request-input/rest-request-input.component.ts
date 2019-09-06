import { Component, OnInit, Input, Injectable } from '@angular/core';
import { Location } from '@angular/common';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { HttpMethod } from 'blocking-proxy/built/lib/webdriver_commands';
import { HttpClient, HttpParams, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-rest-request-input',
  templateUrl: './rest-request-input.component.html',
  styleUrls: ['./rest-request-input.component.scss']
})
@Injectable()
export class RestRequestInputComponent implements OnInit {
  constructor(
    private router: Router,
    private location: Location,
    private httpClient: HttpClient
  ) {
    const urlPattern = /^(http[s]?:\/\/)/;
    this.formGroup = new FormGroup({
      uri: new FormControl(
        '',
        Validators.compose([
          Validators.maxLength(2048),
          Validators.required,
          Validators.pattern(urlPattern)
        ])
      )
    });
  }
  @Input() buttonName: string;
  @Input() options: object;
  formGroup: FormGroup;
  ngOnInit() {
    if (!!this.buttonName) {
      this.buttonName = 'Submit';
    }
    if (this.options === undefined) {
      const headers = {};
      const params = {};
      this.options = { headers, params, responseType: 'text' as 'text' };
    }
  }

  /**
   * Sends the request to the provided URL in the form with the specified
   * method type, headers, and body.
   */
  sendRequest() {
    const output = this.httpClient.get(
      this.formGroup.get('uri').value,
      this.options
    );

    output.subscribe(data => {
      console.log(data);
    });
  }

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
      .map(err => (!!errorMessages[err] ? errorMessages[err] : 'Invalid Input'))
      .join('\n');

    return errorMessage.trim();
  }
}
