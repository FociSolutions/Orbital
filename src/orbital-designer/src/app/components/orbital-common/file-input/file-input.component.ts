import { Component, OnInit, Input, ViewChild, Directive } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor() {}
  accept = '*';
  @Input() control!: FormControl;
  fileName = '';
  @Input() fileTypes(types: string) {
    if (!!types) {
      this.accept = types;
    }
  }

  onFileChange(files: FileList) {
    const file = files[0];
    this.fileName = file.name;
    this.control.setValue(file);
  }

  ngOnInit() {}
}
