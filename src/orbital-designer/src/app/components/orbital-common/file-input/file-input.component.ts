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
  fileNames = '';

  @Input() control!: FormControl;
  @Input() errorMessages: string[] = [];
  @Input() label = '';
  @Input() set fileTypes(types: string) {
    if (!!types) {
      this.accept = types;
    }
  }
  @Input() allowMultiple = false;

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
    if (this.allowMultiple) {
      const filesArray = Array.from(files);
      this.fileNames = filesArray.map(f => f.name).join(', ');
      this.control.setValue(filesArray);
    } else {
      const file = files[0];
      this.fileNames = file.name;
      this.control.setValue(file);
    }
  }

  ngOnInit() {}
}
