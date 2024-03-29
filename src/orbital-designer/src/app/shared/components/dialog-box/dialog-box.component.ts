import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss'],
})
export class DialogBoxComponent {
  @Input() titleText = '';
  @Input() bodyText = '';
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';

  @Output() choiceBoolean: EventEmitter<boolean> = new EventEmitter<boolean>();

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
