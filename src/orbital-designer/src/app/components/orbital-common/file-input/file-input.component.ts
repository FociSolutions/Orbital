import { Component, OnInit, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { ShowOnDirtyErrorStateMatcher } from '@angular/material/core';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  errorStateMatcher = new ShowOnDirtyErrorStateMatcher();
  fileNames = '';

  @Input() control!: FormControl;
  @Input() label = '';
  @Input() accept = '';
  @Input() allowMultiple = false;

  getErrors(): string[] {
    return !!this.control.errors ? Object.values(this.control.errors) : [];
  }

  /**
   * Reads the files and sets the value of the control to either the list or the single file
   * depending on the multiFileInput property.
   * @param files The filelist passed in from the file input
   */
  onFileChange(files: FileList) {
    if (files.length > 0) {
      this.control.markAsDirty();
      const filesArray = Array.from(files);
      this.fileNames = filesArray.map(f => f.name).join(', ');
      this.control.setValue(this.allowMultiple ? filesArray : filesArray[0]);
    }
  }

  ngOnInit() {}
}
