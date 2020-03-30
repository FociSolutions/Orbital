import {
  Component,
  OnInit,
  Input,
  Output,
  EventEmitter,
  ChangeDetectorRef,
  AfterContentChecked
} from '@angular/core';
import * as HttpStatus from 'http-status-codes';
import { Response } from '../../../models/mock-definition/scenario/response.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { NGXLogger } from 'ngx-logger';
import { ResponseType } from 'src/app/models/mock-definition/scenario/response.type';
import { FormGroup } from '@angular/forms';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit, AfterContentChecked {
  readonly responseTypes = [
    { value: ResponseType.CUSTOM, viewValue: 'Custom' },
    { value: ResponseType.NONE, viewValue: 'None' },
    { value: ResponseType.TEMPLATED, viewValue: 'Templated' }
  ];

  @Output() responseOutput: EventEmitter<Response>;
  @Output() isValid: EventEmitter<boolean>;
  @Input() responseFormGroup: FormGroup;

  headers: Record<string, string> = {};

  /**
   *  The validBodyResponse after it has been validated
   */
  validBodyResponse: string;

  /**
   * Boolean indicating if the body is in valid JSON format
   */
  isBodyValid: boolean;

  /**
   * The error message for the body response
   */
  bodyErrorMessage: string;

  /**
   *  The status message for the corresponding code
   */
  statusMessage: string;

  /**
   * The titles for the kvp edit component
   */
  titleForKvp: string;
  titleForKvpAdded: string;

  isCardDisabled: boolean;
  panelExpanded: boolean;
  shouldSave: boolean;

  constructor(
    private jsonService: ValidJsonService,
    private logger: NGXLogger,
    private cdRef: ChangeDetectorRef
  ) {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
    this.titleForKvp = 'Add New Header Rule';
    this.titleForKvpAdded = 'Added Header Rules';
    this.bodyErrorMessage = 'Body Content not in Valid JSON Format';
    this.statusMessage = 'Enter a Status Code';
    this.isBodyValid = true;
  }

  ngOnInit() {
    this.responseFormGroup.controls.status.valueChanges.subscribe(() => {
      const newStatus = this.responseFormGroup.controls.status.value;
      if (newStatus) {
        try {
          this.statusMessage = HttpStatus.getStatusText(Number(newStatus));
          this.responseFormGroup.controls.status.setErrors(null);
        } catch (Error) {
          this.statusMessage = 'Enter a Status Code';
          this.responseFormGroup.controls.status.setErrors({'invalidStatusCode': 'Status code not valid'});
        }
      }
    });
  }

  ngAfterContentChecked(): void {
    this.checkStatus();
    this.cdRef.detectChanges();
  }

  /**
   * If shouldSave is true, validate the response and emit to the parent as well as the isValid boolean
   */
  @Input()
  set saveStatus(save: boolean) {
    this.shouldSave = save;
  }

  @Input()
  set response(newResponse: Response) {
    if (newResponse) {
      this.bodyResponse = newResponse.body;
      this.headers = newResponse.headers;
    }
  }

  /**
   * Checks to see if the body is valid and sets it to the validBodyResponse if valid
   */
  set bodyResponse(bodyContent: string) {
    if (!bodyContent || this.jsonService.isValidJSON(bodyContent)) {
      this.validBodyResponse = bodyContent;
      this.isBodyValid = true;
    } else {
      this.isBodyValid = false;
    }
  }

  /**
   * Gets the valid response body
   */
  get bodyResponse(): string {
    return this.validBodyResponse;
  }

  /**
   * Gets the status code
   */
  get statusCode(): number {
    return this.responseFormGroup.controls.status.value;
  }

  /**
   * Sets the status code
   */
  set statusCode(newStatus: number) {
    this.responseFormGroup.controls.status.setValue(newStatus);
  }

  /**
   * Wait for header KVP , then trigger emitter if current response is valid
   * @param map Response KVP
   */
  saveHeaders(map: Record<string, string>) {
    if (this.responseFormGroup.controls.status.valid && this.isBodyValid) {
        const responseToEmit = {
          headers: map,
          body: this.bodyResponse,
          status: +this.responseFormGroup.controls.status.value
        } as Response;
        this.logger.debug(
          'AddResponseComponent:saveHeaders: Response has been emitted',
          responseToEmit
        );
        this.responseOutput.emit(responseToEmit);
    } else {
      this.disableCard();
    }
  }

  /**
   * Check if current response is valid or not.
   * If not valid, call disable card; otherwise, enable expansion
   */
  private checkStatus() {
    if (this.responseFormGroup.controls.status.valid && this.isBodyValid) {
      this.isCardDisabled = false;
    } else {
      this.disableCard();
    }
  }

  /**
   * Disable and expand the card
   */
  private disableCard() {
    this.logger.debug(
      'AddResponseComponent:disableCard: Disable and expand card'
    );
    this.isCardDisabled = true;
    this.panelExpanded = true;
  }
}
