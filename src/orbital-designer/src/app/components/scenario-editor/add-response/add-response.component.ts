import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as HttpStatus from 'http-status-codes';

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
   * The locally store status code
   */
  statusCodeEntered: string;

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
        this.statusMessage = HttpStatus.getStatusText(+statusCode);
      } catch (Error) {
        this.statusMessage = 'Invalid Status Code';
      }
    }
  }
  statusMessage: string;

  constructor() {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
  }

  ngOnInit() {
    this.statusMessage = '';
    this.statusCode = '';
  }
}
