import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
})
export class TextInputComponent {
  errorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  @Input() title = '';
  @Input() maxLength: number | undefined;
  @Input() multiLine = false;
  @Input() control!: FormControl;

  getErrors(): string[] {
    return this.control.errors ? Object.values(this.control.errors) : [];
  }

  /**
   * Sets the text input to dirty when it becomes out of focus. Required
   * to show the error messages since the state matcher checks if the input is dirty
   */
  setDirty() {
    this.control.markAsDirty();
  }
}
