import { Component, EventEmitter, Input, Output } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss'],
})
export class FileInputComponent {
  constructor(private logger: NGXLogger, private readFileParser: ReadFileService) {}
  fileName: string[] = [];
  currentFileName = '';
  fileContent = '';
  @Input() label = '';
  @Input() accept = '';
  @Input() multiple = true;
  private _errorMessages: Record<string, string[]> = {};
  @Output() fileContentEmit = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();
  @Output() clearContentEmit = new EventEmitter<boolean>();

  /**
   * Emits the contents of the files as strings
   */
  emitFileContent(files: File[]) {
    this.fileName = [];
    for (const file of files) {
      this.readFileParser.read(file).subscribe(
        (fileReadResult) => {
          this.fileName.push(file.name);
          this.currentFileName = file.name;
          this.fileContent = fileReadResult;
          this.fileNameEmit.emit(this.currentFileName);
          this.fileContentEmit.emit(this.fileContent);
        },
        (err) => {
          this._errorMessages[file.name] = err;
          return this._errorMessages;
        }
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
    this._errorMessages = errorMessage;
  }

  get errorMessages() {
    return this._errorMessages;
  }
}
