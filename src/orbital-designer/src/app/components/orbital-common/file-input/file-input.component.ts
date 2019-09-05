import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';
import { Subscription } from 'rxjs';
import { MatInput } from '@angular/material/input';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  private reader: FileReader;
  private errorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  private subscription: Subscription;
  constructor() {
    this.reader = new FileReader();
    this.reader.onloadend = () => {
      this.control.setValue(this.reader.result);
    };
  }
  accept = '*';
  fileName = '';
  @Input() control!: FormControl;
  @Input() errorMessage: string;
  @Input() label: string;
  @Input() fileTypes(types: string) {
    if (!!types) {
      this.accept = types;
    }
  }

  onFileChange(files: FileList) {
    const file = files[0];
    if (!file) {
      return;
    }
    this.fileName = file.name;
    this.reader.readAsText(file);
  }

  ngOnInit() {}
}
