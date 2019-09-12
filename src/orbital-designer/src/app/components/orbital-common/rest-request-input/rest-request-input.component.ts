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
  HttpEvent
} from '@angular/common/http';
import { Observer } from 'rxjs';

@Component({
  selector: 'app-rest-request-input',
  templateUrl: './rest-request-input.component.html',
  styleUrls: ['./rest-request-input.component.scss']
})
@Injectable()
export class RestRequestInputComponent implements OnInit {
  static readonly urlMaxLength = 2048;
  constructor(private httpClient: HttpClient) {
    const urlPattern = /^(http[s]?:\/\/)/;
    this.inputControl = new FormControl(
      '',
      Validators.compose([
        Validators.pattern(urlPattern),
        Validators.maxLength(RestRequestInputComponent.urlMaxLength),
        Validators.required
      ])
    );
    this.responseReceived = new EventEmitter<HttpResponse<unknown>>();
    this.requestObserver = {
      next: event => {
        this.errorMessages = [];
        if (event.type === HttpEventType.Response) {
          this.responseReceived.emit(event);
        }
      },
      error: e => {
        this.errorMessages = ['Server cannot be reached: ' + e.message];
        this.requestInProgress = false;
      },
      complete: () => (this.requestInProgress = false)
    };
  }
  requestObserver: Observer<HttpEvent<HttpResponse<unknown>>>;
  inputControl: FormControl;
  requestInProgress = false;
  @Input() buttonName = 'Submit';
  @Input() errorMessages: string[] = [];
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
  @Output() responseReceived: EventEmitter<HttpResponse<unknown>>;

  ngOnInit() {}

  canSendRequest() {
    return !this.inputControl.valid || this.requestInProgress;
  }

  getSpinnerId() {
    return this.requestInProgress ? 'show-spinner' : 'hide-spinner';
  }

  sendRequest() {
    if (this.inputControl.valid) {
      this.requestInProgress = true;
      const request = new HttpRequest(
        this.httpMethod,
        this.inputControl.value,
        this.body,
        this.options
      );
      this.httpClient.request(request).subscribe(this.requestObserver);
    }
  }
}
