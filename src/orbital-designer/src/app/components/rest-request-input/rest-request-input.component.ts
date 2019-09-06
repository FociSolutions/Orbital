import { Component, OnInit, Input, Injectable } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';
import Json from 'src/app/models/json';

@Component({
  selector: 'app-rest-request-input',
  templateUrl: './rest-request-input.component.html',
  styleUrls: ['./rest-request-input.component.scss']
})
@Injectable()
export class RestRequestInputComponent implements OnInit {
  constructor(private httpClient: HttpClient) {
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
  @Input() httpMethod: string;
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
  public sendRequest<R>(uri?: string): Observable<R> {
    if (!!uri) {
      uri = this.formGroup.get('uri').value;
    }
    switch (this.httpMethod) {
      case 'GET':
        return this.httpClient.get<R>(uri, this.options);
      case 'POST':
        return this.httpClient.post<R>(uri, this.options);
      case 'DELETE':
        return this.httpClient.delete<R>(uri, this.options);
      default:
        return this.httpClient.get<R>(uri, this.options);
    }
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
