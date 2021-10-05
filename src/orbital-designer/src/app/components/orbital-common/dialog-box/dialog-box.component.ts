import { Component, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent {
  @Input() titleText: string;
  @Input() bodyText: string;
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';

  @Output() choiceBoolean: EventEmitter<boolean> = new EventEmitter<boolean>();

  constructor() {}

  /**
   * Emits true to parent when the user wishes the delete a scenario
   */
  onConfirm() {
    this.choiceBoolean.emit(true);
  }

  /**
   * Emits false to parent when the user wishes the delete a scenario
   */
  onCancel() {
    this.choiceBoolean.emit(false);
  }
}
