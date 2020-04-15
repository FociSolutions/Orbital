import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { map } from 'rxjs/operators';
import { recordAdd, recordFirstOrDefaultKey, recordFirstOrDefault } from 'src/app/models/record';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor(private logger: NGXLogger, private readfileparser: ReadFileService) {}
  fileName: string[] = [];
  currentFileName: string;
  fileContent: string;
  @Input() label = '';
  @Input() accept = '';
  @Input() multiple = true;
  private errormessages = {} as Record<string, string[]>;
  @Output() fileContentEmit = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();
  @Output() clearContentEmit = new EventEmitter<boolean>();

  /**
   * Emits the contents of the files as strings
   */
  emitFileContent(files: File[]) {
    this.fileName = [];
    for (const file of files) {
      this.readfileparser
        .read(file)
        .pipe(map(fileReadresult => fileReadresult))
        .subscribe(
          fileReadresult => {
            this.fileName.push(file.name);
            this.currentFileName = file.name;
            this.fileContent = fileReadresult;
            this.fileNameEmit.emit(this.currentFileName);
            this.fileContentEmit.emit(this.fileContent);
          },
          err => recordAdd(this.errormessages, file.name, err)
        );
    }
    this.logger.log('File Contents emitted');
  }

  /**
   * Emits a value to Import From File to clear the form
   *
   * @param x emitted value
   */
  emitClearContent(x: boolean) {
    this.clearContentEmit.emit(x);
  }

  @Input()
  set errorMessage(errorMessage: Record<string, string[]>) {
    this.errormessages = errorMessage;
  }

  get errorMessages() {
    return this.errormessages;
  }

  ngOnInit() {}
}
