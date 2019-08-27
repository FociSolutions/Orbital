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
  @Input() errorMessage: string;

  ngOnInit() {}
}
