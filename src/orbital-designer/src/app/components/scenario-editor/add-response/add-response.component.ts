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

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit, AfterContentChecked {
  @Output() responseOutput: EventEmitter<Response>;
  @Output() isValid: EventEmitter<boolean>;

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
   * The locally store status code
   */
  statusCodeEntered: number;

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
  isStatusCodeValid: boolean;

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
    this.isStatusCodeValid = true;
  }

  ngOnInit() {}

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
      this.statusCode = newResponse.status;
      this.bodyResponse = newResponse.body;
      this.headers = newResponse.headers;
    }
  }

  /**
   * This setter checks to see if the status code field is empty and valid,
   * if it is valid, if parses the string to a number and retrieves the corresponding
   * status code
   */
  set statusCode(statusCode: number) {
    if (statusCode) {
      try {
        this.statusMessage = HttpStatus.getStatusText(Number(statusCode));
        this.statusCodeEntered = statusCode;
        this.isStatusCodeValid = true;
      } catch (Error) {
        this.statusMessage = 'Enter a Status Code';
        this.isStatusCodeValid = false;
      }
    }
  }

  /**
   * Gets the status code from the form field
   */
  get statusCode(): number {
    return this.statusCodeEntered;
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
   * Wait for header KVP , then trigger emitter if current response is valid
   * @param map Response KVP
   */
  saveHeaders(map: Record<string, string>) {
    if (this.isStatusCodeValid && this.isBodyValid) {
      if (this.statusCodeEntered) {
        const responseToEmit = {
          headers: map,
          body: this.bodyResponse,
          status: +this.statusCode
        } as Response;
        this.logger.debug(
          'AddResponseComponent:saveHeaders: Response has been emitted',
          responseToEmit
        );
        this.responseOutput.emit(responseToEmit);
      } else {
        this.logger.debug(
          'AddResponseComponent:saveHeaders: Status code should not be empty'
        );
        this.isStatusCodeValid = false;
        this.disableCard();
      }
    }
  }

  /**
   * Check if current response is valid or not.
   * If not valid, call disable card; otherwise, enable expansion
   */
  private checkStatus() {
    if (this.isStatusCodeValid && this.isBodyValid) {
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
