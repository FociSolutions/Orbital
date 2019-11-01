import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as HttpStatus from 'http-status-codes';
import { Response } from '../../../models/mock-definition/scenario/response.model';

@Component({
  selector: 'app-add-response',
  templateUrl: './add-response.component.html',
  styleUrls: ['./add-response.component.scss']
})
export class AddResponseComponent implements OnInit {
  @Input() response: Response;
  @Input() saveStatus: boolean;

  @Output() responseOutput: EventEmitter<Response>;
  @Output() isValid: EventEmitter<boolean>;

  /**
   *  The kvp map sent up from the child component
   */
  childKvpMap: Map<string, string>;

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
      } catch (Error) {
        this.statusMessage = 'Invalid Status Code';
      }
    }
  }

  constructor() {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
    this.childKvpMap = new Map<string, string>();
    this.titleForKvp = 'Add New Header Rule';
    this.titleForKvpAdded = 'Added Header Rules';
  }

  ngOnInit() {
    this.statusMessage = '';
    this.statusCode = '';
  }
}
