import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  errorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  accept = '*';
  display = '';
  multiFileInput = false;

  @Input() control!: FormControl;
  @Input() errorMessages: string[];
  @Input() label: string;
  @Input() fileTypes(types: string) {
    if (!!types) {
      this.accept = types;
    }
  }
  @Input() set allowMultiple(allowMultiple: boolean) {
    this.multiFileInput = allowMultiple;
  }

  constructor() {}

  /**
   * Reads the files and sets the value of the control to either the list or the single file
   * depending on the multiFileInput property.
   * @param files The filelist passed in from the file input
   */
  onFileChange(files: FileList) {
    if (files.length === 0) {
      return;
    }
    this.control.markAsDirty();
    if (this.multiFileInput) {
      const filesArray = Array.from(files);
      this.display = filesArray.map(f => f.name).join(', ');
      this.control.setValue(filesArray);
    } else {
      const file = files[0];
      this.display = file.name;
      this.control.setValue(file);
    }
  }

  ngOnInit() {}
}
