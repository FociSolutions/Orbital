import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { NGXLogger } from 'ngx-logger';
import { ReadFileService } from 'src/app/services/read-file/read-file.service';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-file-input',
  templateUrl: './file-input.component.html',
  styleUrls: ['./file-input.component.scss']
})
export class FileInputComponent implements OnInit {
  constructor(
    private logger: NGXLogger,
    private readfileparser: ReadFileService
  ) {}
  fileName: string[] = [];
  currentFileName: string;
  fileContent: string;
  @Input() label = '';
  @Input() accept = '';
  @Input() multiple = true;
  errormessages: string[];
  @Output() fileContentEmit = new EventEmitter<string>();
  @Output() fileNameEmit = new EventEmitter<string>();

  /**
   * Emits the contents of the files as strings
   */
  emitFileContent(files: File[]) {
    for (const file of files) {
      this.errormessages = [];
      this.readfileparser.read(file)
      .pipe(map(fileReadresult => fileReadresult))
      .subscribe(
        fileReadresult => {
           this.fileName.push(file.name);
           this.currentFileName = file.name;
           this.fileContent = fileReadresult;
           this.fileNameEmit.emit(this.currentFileName);
           this.fileContentEmit.emit(this.fileContent);
         },
         err => this.errormessages = err
       );
    }
    this.logger.log('File Contents emitted');
  }

@Input()
  set errorMessage(errorMessage: string[]) {
    this.errormessages = errorMessage || [];
    if (this.errormessages) {
      this.fileName.pop();
    }
  }

  ngOnInit() {}
}
