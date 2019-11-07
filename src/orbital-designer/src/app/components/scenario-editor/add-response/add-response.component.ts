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
   *  The kvp map sent up from the child component
   */
  childKvpMap: Map<string, string>;

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
  panelExpanded: any;

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
    this.childKvpMap = new Map<string, string>();
    this.titleForKvp = 'Add New Header Rule';
    this.titleForKvpAdded = 'Added Header Rules';
    this.bodyErrorMessage = 'Body Content not in Valid JSON Format';
    this.isBodyValid = true;
  }

  ngOnInit() {
    this.statusMessage = '';
    this.statusCode = '';
  }

  /**
   * Sets whether the card can be collapsed.
   *
   * If it can be collapsed, then the card becomes non-disabled
   * If it cannot be collapsed, then the card expands and becomes disabled
   */
  set canCollapseCard(canCollapseCard: boolean) {
    if (canCollapseCard) {
      this.isCardDisabled = false;
      this.isValid.emit(true);
      this.logger.debug('canCollapse', canCollapseCard);
      this.logger.debug('isCardDisabled', this.isCardDisabled);
      this.logger.debug('panelExpanded', this.panelExpanded);
    } else {
      this.isCardDisabled = true;
      this.panelExpanded = true;
      this.isValid.emit(false);
      this.logger.debug('canCollapse', canCollapseCard);
      this.logger.debug('isCardDisabled', this.isCardDisabled);
      this.logger.debug('panelExpanded', this.panelExpanded);
    }
  }

  /**
   * If shouldSave is true, validate the response and emit to the parent as well as the isValid boolean
   */
  set saveStatus(shouldSave: boolean) {
    if (shouldSave) {
      if (!!this.statusCode && !!this.childKvpMap && this.isBodyValid) {
        const responseToEmit = {
          headers: this.childKvpMap,
          body: this.bodyResponse,
          status: +this.statusCode
        } as Response;
        this.logger.debug('Response has been emitted', responseToEmit);
        this.responseOutput.emit(responseToEmit);
        this.canCollapseCard = true;
      } else {
        this.canCollapseCard = false;
      }
    } else {
      this.canCollapseCard = true;
    }
  }
}
