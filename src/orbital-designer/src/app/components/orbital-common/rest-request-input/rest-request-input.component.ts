import {
  Component,
  OnInit,
  Input,
  Injectable,
  Output,
  EventEmitter
} from '@angular/core';
import { FormControl, Validators } from '@angular/forms';
import {
  HttpClient,
  HttpResponse,
  HttpRequest,
  HttpEventType,
  HttpEvent,
  HttpErrorResponse
} from '@angular/common/http';
import { Observer } from 'rxjs';
import { timeout } from 'rxjs/operators';

@Component({
  selector: 'app-rest-request-input',
  templateUrl: './rest-request-input.component.html',
  styleUrls: ['./rest-request-input.component.scss']
})
@Injectable()
export class RestRequestInputComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  constructor(private httpClient: HttpClient) {
    this.responseReceived = new EventEmitter<HttpResponse<unknown>>();
    this.requestObserver = {
      next: event => {
        if (event.type === HttpEventType.Response) {
          this.responseReceived.emit(event);
        }
      },
      error: e => {
        this.responseReceived.emit(e);
        this.requestInProgress = false;
      },
      complete: () => (this.requestInProgress = false)
    };
  }
  requestObserver: Observer<
    HttpEvent<HttpResponse<unknown> | HttpErrorResponse>
  >;
  protocols: string[] = ['http://', 'https://'];
  selectedProtocol: string = this.protocols[0];
  inputControl: FormControl;
  requestInProgress = false;
  @Input() title = '';
  @Input() buttonName = 'Submit';
  @Input() set errors(errors: object) {
    if (!!this.inputControl) {
      this.inputControl.setErrors(errors);
    }
  }
  @Input() options: object = {};
  @Input() body?: string = null;
  @Input() httpMethod:
    | 'DELETE'
    | 'GET'
    | 'HEAD'
    | 'JSONP'
    | 'OPTIONS'
    | 'POST'
    | 'PUT'
    | 'PATCH' = 'GET';
  @Input() concatToURI = '';
  @Output() responseReceived: EventEmitter<HttpResponse<unknown>>;

  ngOnInit() {
    this.inputControl = new FormControl(
      '',
      Validators.compose([
        Validators.maxLength(RestRequestInputComponent.urlMaxLength)
      ])
    );
  }

  sendRequestDisabled() {
    return this.inputControl.value.length === 0 || this.requestInProgress;
  }

  getSpinnerId() {
    return this.requestInProgress ? 'show-spinner' : 'hide-spinner';
  }

  sendRequest() {
    this.inputControl.markAsDirty();
    if (this.sendRequestDisabled) {
      this.requestInProgress = true;
      this.errors = null;
      const request = new HttpRequest(
        this.httpMethod,
        `${this.selectedProtocol}${this.inputControl.value}${this.concatToURI}`,
        this.body,
        this.options
      );

      this.httpClient.request(request).pipe(timeout(3000)).subscribe(this.requestObserver);
    }
  }
}
