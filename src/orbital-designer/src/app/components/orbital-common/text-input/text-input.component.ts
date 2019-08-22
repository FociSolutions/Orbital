import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss']
})
export class TextInputComponent implements OnInit {
  constructor() {}
  @Input() title = '';
  @Input() maxLength?: number;
  @Input() multiLine?: boolean;
  @Input() control: FormControl;
  @Input() errorMessages: Map<string, string> = new Map<string, string>();

  ngOnInit() {}

  private get errorMessage(): string {
    const errors = Object.keys(this.control.errors);
    let message = '';
    for (const error of errors) {
      message = message.concat(`${this.errorMessages.get(error)}\n`);
    }
    return message.trim();
  }
}
