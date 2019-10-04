import { Component, OnInit, Input, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-dialog-box',
  templateUrl: './dialog-box.component.html',
  styleUrls: ['./dialog-box.component.scss']
})
export class DialogBoxComponent implements OnInit {
  @Input() titleText: string;
  @Input() bodyText: string;
  @Input() confirmButtonText = 'Confirm';
  @Input() cancelButtonText = 'Cancel';

  @Output() choiceBoolean: EventEmitter<boolean>;

  constructor() {
    this.choiceBoolean = new EventEmitter<boolean>();
  }

  onConfirm() {
    this.choiceBoolean.emit(true);
  }

  onCancel() {
    this.choiceBoolean.emit(false);
  }

  ngOnInit() {}
}
