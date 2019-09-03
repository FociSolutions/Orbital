import {
  Component,
  OnInit,
  Input,
  ViewChild,
  Directive,
  SimpleChanges
} from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  private reader: FileReader;
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
  @Input() placeholder: string;
  @Input() fileTypes(types: string) {
    if (!!types) {
      this.accept = types;
    }
  }

  async onFileChange(files: FileList) {
    const file = files[0];
    this.fileName = file.name;
    this.reader.readAsText(file);
  }

  ngOnInit() {}
}
