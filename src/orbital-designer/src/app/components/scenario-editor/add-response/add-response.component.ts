import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

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

  constructor() {
    this.responseOutput = new EventEmitter<Response>();
    this.isValid = new EventEmitter<boolean>();
  }

  ngOnInit() {}
}
