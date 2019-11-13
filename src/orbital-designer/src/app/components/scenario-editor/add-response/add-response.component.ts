import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as HttpStatus from 'http-status-codes';
import { Response } from '../../../models/mock-definition/scenario/response.model';
import { ValidJsonService } from 'src/app/services/valid-json/valid-json.service';
import { NGXLogger } from 'ngx-logger';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit {
  @Input() response: Response;

  @Output() responseOutput: EventEmitter<Response>;
  @Output() isValid: EventEmitter<boolean>;

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
  statusCodeEntered: string;

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

  /**
   * Gets the status code from the form field
   */
  get statusCode(): string {
    return this.statusCodeEntered;
  }

  /**
   * This setter checks to see if the status code field is empty and valid,
   * if it is valid, if parses the string to a number and retrieves the corresponding
   * status code
   */
  set statusCode(statusCode: string) {
    if (statusCode === '') {
      this.statusMessage = 'Enter a Status Code';
    } else {
      try {
        this.statusMessage = HttpStatus.getStatusText(Number(statusCode));
        this.statusCodeEntered = statusCode;
      } catch (Error) {
        this.statusMessage = 'Invalid Status Code';
      }
    }
  }

  /**
   * Checks to see if the body is valid and sets it to the validBodyResponse if valid
   */
  set bodyResponse(bodyContent: string) {
    if (this.jsonService.isValidJSON(bodyContent)) {
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

  constructor(
    private jsonService: ValidJsonService,
    private logger: NGXLogger
  ) {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
    this.titleForKvp = 'Add New Header Rule';
    this.titleForKvpAdded = 'Added Header Rules';
    this.bodyErrorMessage = 'Body Content not in Valid JSON Format';
    this.isBodyValid = true;
  }

  ngOnInit() {
    this.statusMessage = '';
    this.statusCode = '';
  }

  saveHeaderMap(map: Map<string, string>) {
    if (!!this.statusCode && this.isBodyValid) {
      const responseToEmit = {
        headers: map,
        body: this.bodyResponse,
        status: +this.statusCode
      } as Response;
      this.logger.debug('Response has been emitted', responseToEmit);
      this.responseOutput.emit(responseToEmit);
    } else {
    }
  }

  /**
   * If shouldSave is true, validate the response and emit to the parent as well as the isValid boolean
   */
  @Input()
  set saveStatus(save: boolean) {
    this.shouldSave = save;
  }
}
